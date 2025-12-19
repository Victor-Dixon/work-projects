from __future__ import annotations

import argparse
import sys
import tempfile
from pathlib import Path

from .aggregate import Aggregator, write_jsonl
from .agents import Agent
from .core import CoreDataset, compute_file_sha256
from .safefs import SandboxFS, SandboxViolation


def _read_expected_hash(core_hash_path: Path) -> str:
    return core_hash_path.read_text(encoding="utf-8").strip().split()[0]


def run(out_dir: Path) -> dict:
    repo_root = Path(__file__).resolve().parents[1]
    core_path = repo_root / "isolation_proof" / "core" / "core.jsonl"
    core_hash_path = repo_root / "isolation_proof" / "core" / "core.sha256"

    expected = _read_expected_hash(core_hash_path)
    core = CoreDataset(path=core_path, expected_sha256=expected)

    # Baseline proof anchor.
    before = compute_file_sha256(core_path)
    core_records = core.load()

    agents_root = out_dir / "agents"
    alpha_root = agents_root / "agent_alpha"
    beta_root = agents_root / "agent_beta"

    alpha = Agent(
        agent_id="agent_alpha",
        fs=SandboxFS(allowed_root=alpha_root, deny_roots=(core_path.parent, beta_root)),
    )
    beta = Agent(
        agent_id="agent_beta",
        fs=SandboxFS(allowed_root=beta_root, deny_roots=(core_path.parent, alpha_root)),
    )

    alpha_entries = alpha.analyze(core_records)
    beta_entries = beta.analyze(core_records)

    alpha.write_entries_jsonl("entries.jsonl", alpha_entries)
    beta.write_entries_jsonl("entries.jsonl", beta_entries)

    # Deliberate break attempts (should fail without affecting core).
    violations: list[str] = []
    try:
        with alpha.fs.open_text_for_write("../agent_beta/pwn.jsonl") as f:
            f.write("{}\n")
    except SandboxViolation as e:
        violations.append(f"alpha->beta blocked: {e}")

    try:
        # Try to reach the real frozen core file via path traversal.
        # (SandboxFS should block *any* write outside beta's allowed_root.)
        with beta.fs.open_text_for_write("../../../../core/core.jsonl") as f:
            f.write("{\"oops\":true}\n")
    except SandboxViolation as e:
        violations.append(f"beta->core blocked: {e}")

    # Verify core immutability.
    core.verify_immutable()
    after = compute_file_sha256(core_path)

    aggregator = Aggregator()
    aggregated = aggregator.aggregate(
        [
            alpha_root / "entries.jsonl",
            beta_root / "entries.jsonl",
        ]
    )
    agg_path = out_dir / "aggregate.jsonl"
    write_jsonl(agg_path, aggregated)

    return {
        "core_sha256_before": before,
        "core_sha256_after": after,
        "core_sha256_expected": expected,
        "agent_alpha_entries": len(alpha_entries),
        "agent_beta_entries": len(beta_entries),
        "aggregate_entries": len(aggregated),
        "violations": violations,
        "out_dir": str(out_dir),
        "aggregate_path": str(agg_path),
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Operational isolation proof demo")
    parser.add_argument(
        "--out",
        type=str,
        default=None,
        help="Output directory for agent sandboxes + aggregate (default: temp dir)",
    )
    args = parser.parse_args(argv)

    if args.out:
        out_dir = Path(args.out).resolve()
        out_dir.mkdir(parents=True, exist_ok=True)
        result = run(out_dir)
    else:
        with tempfile.TemporaryDirectory(prefix="isolation_proof_") as td:
            result = run(Path(td))

    # Print a machine-readable summary (so you can diff runs).
    for k in sorted(result.keys()):
        print(f"{k}={result[k]}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any, Iterable

from .core import CORE_KEYS
from .safefs import SandboxFS


class ProjectionError(ValueError):
    pass


def _validate_projection(projection: dict[str, Any]) -> None:
    missing = [k for k in CORE_KEYS if k not in projection]
    extra = [k for k in projection.keys() if k not in CORE_KEYS]
    if missing or extra:
        raise ProjectionError(f"Invalid projection; missing={missing}, extra={extra}")


@dataclass(frozen=True)
class Agent:
    agent_id: str
    fs: SandboxFS

    def write_entries_jsonl(self, rel_path: str, entries: Iterable[dict[str, Any]]) -> None:
        with self.fs.open_text_for_write(rel_path) as f:
            for entry in entries:
                f.write(json.dumps(entry, sort_keys=True, separators=(",", ":")) + "\n")

    def analyze(self, core_records: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Produces agent-local entries that explicitly project to S1-S7."""
        entries: list[dict[str, Any]] = []

        if self.agent_id == "agent_alpha":
            # Alpha: agrees vulnerability exists and claims patch is effective.
            for r in core_records:
                if r["S1"] == "CORE-0002":
                    projection = dict(r)
                    _validate_projection(projection)
                    entries.append(
                        {
                            "agent_id": self.agent_id,
                            "kind": "analysis",
                            "projection": projection,
                            "local": {
                                "assessment": "patch likely effective",
                                "confidence": 0.62,
                                "evidence": ["release notes mention fix"],
                            },
                        }
                    )

        if self.agent_id == "agent_beta":
            # Beta: disputes that the patch fully resolves the issue.
            for r in core_records:
                if r["S1"] == "CORE-0002":
                    projection = dict(r)
                    _validate_projection(projection)
                    entries.append(
                        {
                            "agent_id": self.agent_id,
                            "kind": "analysis",
                            "projection": projection,
                            "local": {
                                "assessment": "patch may be incomplete",
                                "confidence": 0.71,
                                "evidence": ["independent reproduction after patch"],
                                "repro": {
                                    "steps": ["install v2.1.3", "run fuzz harness", "observe crash"],
                                    "artifact": "crashlog-42.txt",
                                },
                            },
                        }
                    )

        return entries

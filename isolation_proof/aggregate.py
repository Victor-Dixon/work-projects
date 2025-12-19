from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

from .core import CORE_KEYS, load_jsonl


class AggregationError(ValueError):
    pass


def project_entry(entry: dict[str, Any]) -> dict[str, Any]:
    projection = entry.get("projection")
    if not isinstance(projection, dict):
        raise AggregationError("Entry missing dict 'projection'")

    missing = [k for k in CORE_KEYS if k not in projection]
    extra = [k for k in projection.keys() if k not in CORE_KEYS]
    if missing or extra:
        raise AggregationError(f"Projection invalid; missing={missing}, extra={extra}")

    # Thin layer: union + projection + provenance.
    return {
        "agent_id": entry.get("agent_id"),
        "kind": entry.get("kind"),
        "S": {k: projection[k] for k in CORE_KEYS},
        "local": entry.get("local", {}),
    }


@dataclass(frozen=True)
class Aggregator:
    def read_agent_entries(self, path: Path) -> list[dict[str, Any]]:
        return load_jsonl(path)

    def aggregate(self, agent_entry_paths: Iterable[Path]) -> list[dict[str, Any]]:
        out: list[dict[str, Any]] = []
        for p in agent_entry_paths:
            for entry in self.read_agent_entries(p):
                out.append(project_entry(entry))
        return out


def write_jsonl(path: Path, rows: Iterable[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        for row in rows:
            f.write(json.dumps(row, sort_keys=True, separators=(",", ":")) + "\n")

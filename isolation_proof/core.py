from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable


CORE_KEYS = ("S1", "S2", "S3", "S4", "S5", "S6", "S7")


class CoreSchemaError(ValueError):
    pass


def compute_file_sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def load_jsonl(path: Path) -> list[dict]:
    rows: list[dict] = []
    with path.open("r", encoding="utf-8") as f:
        for line_no, line in enumerate(f, start=1):
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError as e:
                raise ValueError(f"Invalid JSON on line {line_no} of {path}: {e}") from e
            rows.append(obj)
    return rows


def validate_core_records(records: Iterable[dict]) -> None:
    for idx, rec in enumerate(records):
        missing = [k for k in CORE_KEYS if k not in rec]
        extra = [k for k in rec.keys() if k not in CORE_KEYS]
        if missing or extra:
            raise CoreSchemaError(
                f"Core record {idx} violates schema; missing={missing}, extra={extra}"
            )


@dataclass(frozen=True)
class CoreDataset:
    path: Path
    expected_sha256: str

    def verify_immutable(self) -> None:
        actual = compute_file_sha256(self.path)
        if actual != self.expected_sha256:
            raise AssertionError(
                f"Core hash mismatch for {self.path}. expected={self.expected_sha256} actual={actual}"
            )

    def load(self) -> list[dict]:
        records = load_jsonl(self.path)
        validate_core_records(records)
        return records

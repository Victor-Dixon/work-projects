from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import BinaryIO, TextIO


class SandboxViolation(PermissionError):
    pass


@dataclass(frozen=True)
class SandboxFS:
    """A minimal write-guard proving isolation by construction.

    Agents may read anything, but *writes* must be under allowed_root and must not
    fall under any deny_root.
    """

    allowed_root: Path
    deny_roots: tuple[Path, ...]

    def _ensure_write_allowed(self, path: Path) -> None:
        path = path.resolve()
        allowed = self.allowed_root.resolve()

        try:
            path.relative_to(allowed)
        except ValueError as e:
            raise SandboxViolation(f"Write denied (outside sandbox): {path}") from e

        for deny in self.deny_roots:
            deny = deny.resolve()
            try:
                path.relative_to(deny)
            except ValueError:
                continue
            raise SandboxViolation(f"Write denied (in denied root {deny}): {path}")

    def open_text_for_write(self, rel_path: str) -> TextIO:
        out_path = (self.allowed_root / rel_path).resolve()
        self._ensure_write_allowed(out_path)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        return out_path.open("w", encoding="utf-8")

    def open_binary_for_write(self, rel_path: str) -> BinaryIO:
        out_path = (self.allowed_root / rel_path).resolve()
        self._ensure_write_allowed(out_path)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        return out_path.open("wb")

from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from isolation_proof.demo import run


class TestIsolationProof(unittest.TestCase):
    def test_core_hash_stable_and_writes_isolated(self) -> None:
        with tempfile.TemporaryDirectory(prefix="isolation_proof_test_") as td:
            result = run(Path(td))

        self.assertEqual(result["core_sha256_before"], result["core_sha256_after"])
        self.assertEqual(result["core_sha256_before"], result["core_sha256_expected"])

        # Ensure break attempts were actually blocked.
        self.assertTrue(any("alpha->beta blocked" in v for v in result["violations"]))
        self.assertTrue(any("beta->core blocked" in v for v in result["violations"]))

        # Ensure disagreements can coexist: both agents contribute separate entries.
        self.assertGreaterEqual(result["agent_alpha_entries"], 1)
        self.assertGreaterEqual(result["agent_beta_entries"], 1)
        self.assertEqual(result["aggregate_entries"], result["agent_alpha_entries"] + result["agent_beta_entries"])


if __name__ == "__main__":
    unittest.main()

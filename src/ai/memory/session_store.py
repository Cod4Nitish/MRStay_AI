import logging
import time
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class SessionStore:
    """
    ==========================================================
    MRStay AI
    In-memory session state store

    Lightweight MVP replacement for persistent memory/CRM.
    Keyed by session_id, holds whatever partial data an agent
    (e.g. LeadQualificationAgent) has collected across turns.

    NOTE: This is process-local and non-persistent — restarting
    the backend clears all sessions. Fine for demo; swap for
    Redis/DB-backed storage before production.
    ==========================================================
    """

    def __init__(self, ttl_seconds: int = 3600):
        self._store: Dict[str, Dict[str, Any]] = {}
        self._timestamps: Dict[str, float] = {}
        self.ttl_seconds = ttl_seconds

    def get(self, session_id: str) -> Dict[str, Any]:
        self._evict_if_expired(session_id)
        return self._store.get(session_id, {})

    def update(self, session_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Merges new fields into existing session data. None values
        in `data` are ignored (they mean "not extracted this
        turn", not "clear this field").
        """

        current = self._store.get(session_id, {})

        for key, value in data.items():
            if value is not None:
                current[key] = value

        self._store[session_id] = current
        self._timestamps[session_id] = time.time()

        return current

    def clear(self, session_id: str):
        self._store.pop(session_id, None)
        self._timestamps.pop(session_id, None)

    def _evict_if_expired(self, session_id: str):
        ts = self._timestamps.get(session_id)
        if ts and (time.time() - ts) > self.ttl_seconds:
            logger.info(f"Session {session_id} expired, clearing.")
            self.clear(session_id)

    def statistics(self) -> Dict[str, Any]:
        return {
            "active_sessions": len(self._store)
        }


# Single shared instance — imported by agents/orchestrator that
# need cross-turn state within this process.
session_store = SessionStore()
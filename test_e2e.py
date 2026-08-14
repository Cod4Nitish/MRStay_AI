from src.ai.workflows.agent_orchestrator import AgentOrchestrator

o = AgentOrchestrator()

tests = [
    ("Hi", "greeting"),
    ("Hello", "greeting"),
    ("What is 7th Avenue?", "property_query"),
    ("What is the price?", "property_query"),
    ("What amenities are available at 7th Avenue?", "property_query"),
    ("I want a site visit for 7th Avenue", "lead_capture"),
    ("My budget is 90 lakh", "lead_capture"),
    ("Please call me tomorrow", "lead_capture"),
    ("I want to talk to a human agent", "human_handoff"),
    ("asdkjaskjdlakjsd random gibberish", None),
]

sid = "e2e_test"
passed = 0
failed = 0

print("=" * 70)
print("MRStay AI — End-to-End Agent Test Suite")
print("=" * 70)

for msg, expected in tests:
    r = o.route(msg, session_id=sid)
    ok = (expected is None) or (r["intent"] == expected)
    status = "PASS" if ok else "FAIL"

    if ok:
        passed += 1
    else:
        failed += 1

    print(
        f"[{status}] '{msg}' -> "
        f"intent={r['intent']}, "
        f"agent={r['agent_used']}, "
        f"latency={r['latency_ms']}ms"
    )

print("=" * 70)
print(f"Results: {passed} passed, {failed} failed out of {len(tests)} tests")
print("=" * 70)

if failed > 0:
    exit(1)
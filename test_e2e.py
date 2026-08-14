from src.ai.workflows.agent_orchestrator import AgentOrchestrator

o = AgentOrchestrator()

print("=" * 70)
print("MRStay AI — End-to-End Agent Test Suite")
print("=" * 70)

passed = 0
failed = 0

def check(label, r, expected_intent, expected_agent=None):
    global passed, failed
    ok = r["intent"] == expected_intent
    if expected_agent:
        ok = ok and r["agent_used"] == expected_agent
    status = "PASS" if ok else "FAIL"
    if ok:
        passed += 1
    else:
        failed += 1
    print(
        f"[{status}] {label} -> "
        f"intent={r['intent']}, agent={r['agent_used']}, "
        f"latency={r['latency_ms']}ms"
    )

# --- Single-turn tests (independent session each) ---
single_tests = [
    ("Hi", "greeting", "reception_agent"),
    ("Hello", "greeting", "reception_agent"),
    ("What is 7th Avenue?", "property_query", "property_agent"),
    ("What is the price?", "property_query", "property_agent"),
    ("What amenities are available at 7th Avenue?", "property_query", "property_agent"),
    ("I want to talk to a human agent", "human_handoff", "sales_manager_agent"),
]

for i, (msg, expected_intent, expected_agent) in enumerate(single_tests):
    r = o.route(msg, session_id=f"single_{i}")
    check(f"'{msg}'", r, expected_intent, expected_agent)

# --- Multi-turn lead conversation (SAME session_id throughout) ---
lead_sid = "multi_turn_lead_test"

r1 = o.route("I want a site visit for 7th Avenue", session_id=lead_sid)
check("'I want a site visit for 7th Avenue'", r1, "lead_capture", "lead_qualification_agent")

r2 = o.route("Shivani", session_id=lead_sid)
check("'Shivani' (follow-up, same session)", r2, "lead_capture", "lead_qualification_agent")

r3 = o.route("My budget is 90 lakh", session_id=lead_sid)
check("'My budget is 90 lakh' (follow-up, same session)", r3, "lead_capture", "lead_qualification_agent")

r4 = o.route("9876543210", session_id=lead_sid)
check("'9876543210' (follow-up, same session)", r4, "lead_capture", "lead_qualification_agent")

print(f"Final agent response: {r4['response']}")

print("=" * 70)
print(f"Results: {passed} passed, {failed} failed out of {passed + failed} tests")
print("=" * 70)

if failed > 0:
    exit(1)
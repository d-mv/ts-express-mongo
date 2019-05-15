import { callAPI } from "./call_api";

// try to check and fail without token
test("Server returns answer", async () => {
  try {
    const answer = await callAPI("user/check");
    expect(typeof answer).toBe("object");
    expect(answer.status).toBe(false);
    expect(answer.message).toBe("Unauthorized (no token)");
  } catch (e) {
    console.log(e);
  }
});

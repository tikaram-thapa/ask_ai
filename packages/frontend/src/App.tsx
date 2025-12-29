import { useEffect, useState, useRef } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<
    Array<{ id: string; message: string }>
  >([]);
  const [inputPrompt, setInputPrompt] = useState("");
  // refs for scroll management
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Fetch message from the backend API on component mount
  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching message:", error));
    fetch("/api/conversations")
      .then((res) => res.json())
      .then((data) => {
        const convoMessages = data.conversations.map((value: any) => {
          return {
            id: value.id,
            message: value.message,
          };
        });
        setConversation(convoMessages);
      });
  }, [conversation, setConversation]);

  // Handle scroll position
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20; // 20px tolerance
    setIsAtBottom(nearBottom);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll only if user is at bottom
  useEffect(() => {
    if (isAtBottom) {
      const el = containerRef.current;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    }
  }, [conversation, isAtBottom]);

  // Handle form submission
  const handleSubmit = () => {
    // Prevent default form submission behavior
    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: inputPrompt,
        conversationId: "default-conversation-id",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Update conversation state with the new message
        setConversation((prevConversation) => [
          ...prevConversation,
          { id: `${Date.now()}_prompt`, message: inputPrompt },
          { id: `${Date.now()}_response`, message: data.message },
        ]);
        setInputPrompt(""); // Clear the input field
      });
  };

  return (
    <>
      <div
        className="max-h-50 sm:max-h-150 h-screen overflow-y-scroll p-4"
        ref={containerRef}
      >
        {conversation.length === 0 && (
          <p className="text-center mt-4">No conversations yet.</p>
        )}
        {conversation.map((convo) => (
          <div key={convo.id} className="flex m-2">
            {convo.id.includes("_prompt") ? (
              <div className="flex justify-start mb-2">
                <div className="bg-gray-200 text-black px-4 py-2 rounded-lg max-w-xs">
                  {convo.message}
                </div>
              </div>
            ) : (
              <div className="flex justify-end w-full mb-2">
                <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs">
                  {convo.message}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex flex-col mb-10 justify-center ">
        <div className="text-left p-2">
          {message ? <b>{message}</b> : <b>Loading...</b>}
        </div>
        <textarea
          className="textarea textarea-md h-32 min-w-100 sm:min-w-200 border-2 border-gray-300 rounded-md p-2"
          placeholder="Ask Anything"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        ></textarea>
        <button
          onClick={handleSubmit}
          className="btn btn-circle justify-center"
          style={{
            borderRadius: "50%",
            height: "60px",
            position: "absolute",
            marginTop: "95px",
            marginLeft: "730px",
          }}
        >
          <svg
            width="22px"
            height="22px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 3C12.2652 3 12.5196 3.10536 12.7071 3.29289L19.7071 10.2929C20.0976 10.6834 20.0976 11.3166 19.7071 11.7071C19.3166 12.0976 18.6834 12.0976 18.2929 11.7071L13 6.41421V20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20V6.41421L5.70711 11.7071C5.31658 12.0976 4.68342 12.0976 4.29289 11.7071C3.90237 11.3166 3.90237 10.6834 4.29289 10.2929L11.2929 3.29289C11.4804 3.10536 11.7348 3 12 3Z"
                fill="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </div>
    </>
  );
}

export default App;

import React, {useState, useEffect} from "react";
import {useUserTyping, useBotTyping, ChatWindow} from "@conversationalcomponents/chat-window";

const userAvatar = "https://img.icons8.com/color/search/0";
const botAvatar = "https://img.icons8.com/color/search/1";

export const Chat = () => {
    const [content, setContent] = useState([]);
    const [lastInputValue, setLastInputValue] = useState("");
    const [lastUnsubmittedInput, setLastUnsubmittedInput] = useState("");
    const [nextBotReply, setNextBotReply] = useState("");

    useEffect(() => {
        const lastEntry = content.length && content[content.length - 1];
        if (!lastEntry || lastEntry.isUser) return;
        talk(lastInputValue);        
        setLastInputValue("");
    }, [content]);

    useEffect(() => {
        lastInputValue && setLastUnsubmittedInput("");
    }, [lastInputValue]);

    useUserTyping(content, setContent, lastUnsubmittedInput, lastInputValue, userAvatar);
    const isBotDoneTyping = useBotTyping(content, setContent, lastInputValue, botAvatar);

    useEffect(() => {
        if (!isBotDoneTyping || !nextBotReply) return;
        const lastEntry = content.length && content[content.length - 1];
        if (!lastEntry || lastEntry.isUser) return;
        lastEntry.message = nextBotReply;
        lastEntry.isLoading = false;
        setNextBotReply("");
    }, [isBotDoneTyping]);

    
    const talkGetMethod = (word) => {
        fetch(`http://localhost:5000/talk/${word}`, {
                method: 'get'
        })
        .then(response => response.json())
        .then(data => {
            setNextBotReply(data);
        }); 
    };

    const talk = (text) => {
        fetch('http://localhost:5000/talk', {
			method: 'post',
			headers: {'Content-Type':'application/json'},
			body: JSON.stringify({
				text: text
			})
		})
		.then(response => response.json())
		.then(data => {
			setNextBotReply(data);
		});
    }

    return (
        <ChatWindow
            headerAdditionalContent={<div style={{flex: 1, display: "flex", justifyContent: "center"}}>HEADER</div>}
            content={content}
            onChange={(text) => setLastUnsubmittedInput(text)}
            onSubmit={(text) => setLastInputValue(text)}
        />
    );
};

export default Chat;
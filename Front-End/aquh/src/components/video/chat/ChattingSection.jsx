import { OpenVidu } from "openvidu-browser";

import axios from "axios";
import React, { Component, useState, useEffect, useRef } from "react";
import "./ChattingSection.css";
import UserVideoComponent from "../UserVideoComponent";
import { json } from "react-router-dom";

import { useRecoilState, useRecoilValue } from "recoil";
import { memberNumberState } from "../../../store/loginUserState";
import { memberNicknameState } from "../../../store/loginUserInfoState";

import https from "../../../utils/https";

import { BsSendFill } from "react-icons/bs";
import ChattingAvatarImg from "../../ui/ChattingAvatarImg";


export default function ChattingSection({ bubbleNum = 0 }) {
  const memberNumber = useRecoilValue(memberNumberState);
  const memberNickName = useRecoilValue(memberNicknameState);

  // SSE 연결하기
  useEffect(()=>{
    const eventSource = new EventSource(
      `https://i9b108.p.ssafy.io:8080/api/v1/bubble/chat/${bubbleNum}`
    );
    eventSource.onmessage = (event) => {
      
      const data = JSON.parse(event.data);
      // console.log(data);
  
      // 로그인 유저가 보낸 메세지
      if (data.sender === memberNumber) {
        // 파란 박스(오른쪽)
        initMyMessage(data);
      } else {
        // 회색 박스 (왼쪽)
        initYourMessage(data);
      }
    };
  },[]);

  // 파란 박스 초기화/동기화
  function initMyMessage(data) {
    let chatBox = document.querySelector("#chat-box");
    let md = data.createdAt.substring(5, 10);
    let tm = data.createdAt.substring(11, 16);
    let convertTime = tm + " | " + md;

    let sendBox = `
            <div id="outgoingMsg">
                <div id="sendMsg">
                    <p id="sendMsgData">${data.msg}</p>
                    <div id="chatting-info">
                    <span id="timeDate"> 
                      ${convertTime}
                      <b>${data.nickName}</b>
                      </span>
                      ${<ChattingAvatarImg level="1"/>}
                    </div>
                </div>
            </div>
            `;

    chatBox.innerHTML += sendBox;
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // 회색 박스 초기화/동기화
  function initYourMessage(data) {
    let chatBox = document.querySelector("#chat-box");
    let md = data.createdAt.substring(5, 10);
    let tm = data.createdAt.substring(11, 16);
    let convertTime = tm + " | " + md;

    let receivedBox = `
            <div id="receivedMsg">
                <div id="receivedWithdMsg">
                    <p id="receivedWithdMsgData">${data.msg}</p>
                    <span id="timeDate"> ${convertTime} / <b>${data.nickName}</b> </span>
                </div>
            </div>`;

    chatBox.innerHTML += receivedBox;
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // DB에 새 채팅 보내기 : AJAX 채팅 메시지 전송
  async function addMessage() {
    let msgInput = document.querySelector("#chat-outgoing-msg");

    let chat = {
      bubbleNumber: bubbleNum,
      msg: msgInput.value,
      nickName: memberNickName,
    };

    https.post("/api/v1/bubble/chat", chat).catch((result) => console.log(result));

    msgInput.value = "";
  }

  // 전송 버튼 클릭시 메시지 전송
  const enterMsg = () => {
    addMessage();
  };

  // 엔터를 치면 메시지 전송
  const sendMsg = (e) => {
    if (e.keyCode === 13) {
      addMessage();
    }
  };

  return (
    <div id="user_chat_data">
      <div id="chat-box"></div>

      <div id="typeMsg">
        <input
          onKeyDown={(e) => sendMsg(e)}
          id="chat-outgoing-msg"
          type="text"
          placeholder="메세지를 입력하세요"
        />
        <button id="chat-send" onClick={enterMsg} type="button">
          <div id="chat-send-icon">
            <BsSendFill />
          </div>
        </button>
      </div>
    </div>
  );
}

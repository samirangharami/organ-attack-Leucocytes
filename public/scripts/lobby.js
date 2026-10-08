import { renderPlayers } from "./renderer/render_players.js";
import { renderTimeOut } from "./renderer/render_timeout.js";

const amIHost = (players, myID) => {
  const me = players.find((player) => player.id === myID);
  return me && me.type === "host";
};

const triggerGameSetup = async (roomID) =>
  await fetch("/setup-game", {
    method: "POST",
    body: JSON.stringify({ roomID }),
  });

const renderTableFooter = (
  initLobbyIntervalID,
  roomID,
  currentPlayersCount,
) => {
  const tableFooter = document.querySelector("#table-footer");
  const button = document.createElement("button");

  if (currentPlayersCount > 1) {
    tableFooter.innerHTML = "";
    button.textContent = "Start";
    button.classList.add("start-button");
    tableFooter.append(button);

    button.addEventListener("click", () => {
      clearInterval(initLobbyIntervalID);
      triggerGameSetup(roomID);
      window.location.href = "/game-page";
    });
    return;
  }

  const waitingMsg = document.querySelector("#waiting-msg");
  waitingMsg.textContent = "waiting for players to join";
};

const leaveLobby = (isHost) => {
  const button = document.querySelector(".exit-button");

  button.onclick = async () => {
    const { success } = await fetch("/leave-lobby", {
      method: "post",
      body: JSON.stringify({ isHost }),
    }).then((res) => res.json())
      .catch((err) => console.error(err.message));

    if (success) window.location.href = "/";
  };
};

const copyRoomID = () => {
  const copyBtn = document.querySelector("#copy-btn");
  let copyTimeoutId = null;

  copyBtn.addEventListener("click", () => {
    const id = document.querySelector("#room-id").textContent.trim();

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(id).catch((err) => console.error(err));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = id;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.prepend(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
      } catch (error) {
        console.error(error);
      } finally {
        textArea.remove();
      }
    }

    const originalSrc = "/assets/icons/copy-icon.png";
    copyBtn.src = "/assets/icons/tick-icon.svg";

    let prompt = document.querySelector("#copy-prompt");
    if (!prompt) {
      prompt = document.createElement("span");
      prompt.id = "copy-prompt";
      prompt.textContent = "Copied to clipboard!";
      copyBtn.parentNode.insertBefore(prompt, copyBtn.nextSibling);
    }

    if (copyTimeoutId) {
      clearTimeout(copyTimeoutId);
    }

    copyTimeoutId = setTimeout(() => {
      copyBtn.src = originalSrc;
      const currentPrompt = document.querySelector("#copy-prompt");
      if (currentPrompt) {
        currentPrompt.remove();
      }
      copyTimeoutId = null;
    }, 2000);
  });
};

(() => {
  let initLobbyIntervalID;

  const initiateLobby = async () => {
    const response = await fetch("/get-players").catch(() => {});
    const { players, myID, roomID, redirectPath, roomAvailable, started } =
      await response.json();
    if (!roomAvailable) window.location.href = "/";
    if (started) window.location.href = "/game-page";

    renderPlayers(players, myID, roomID);
    const isHost = amIHost(players, myID);
    leaveLobby(isHost);
    if (isHost) renderTableFooter(initLobbyIntervalID, roomID, players.length);
  };

  window.onload = () => {
    copyRoomID();
    initLobbyIntervalID = setInterval(initiateLobby, 1000);
  };
})();

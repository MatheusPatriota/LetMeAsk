import copyImg  from "../assets/images/copy.svg"

import '../styles/room-code.scss'

type RoomCodeProps = {
  code: string
}

export function RoomCode(props: RoomCodeProps){
  function copyRoomCodeToClipboard(){
    navigator.clipboard.writeText('-Md-601mLZMxYwFnDha2?');
  }
  return(
    <button className="room-code">
      <div>
        <img src={copyImg} alt="copy room code" />
      </div>
      <span>
        Sala #{props.code}
      </span>
    </button>
  );
}
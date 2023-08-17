import React from "react";
import classes from "./SymbolPortrait.module.css";
import https from "../../utils/https";
import { useRecoilValue } from "recoil";
import { memberActiveSymbolState } from "../../store/loginUserInfoState";
export default function SymbolPortrait({
  symbolNumber,
  symbolImgName,
  symbolName,
  isActive,
  isAcquired,
  symbolCode,
  symbolConditionCnt,
}) {
  const memberActiveSymbols = useRecoilValue(memberActiveSymbolState);

  const [hover, setHover] = useState<string>('');

  const handleClick = () => {
    if (isAcquired === true) {
      console.log("유저심볼 : ", memberActiveSymbols.length);

      if (memberActiveSymbols.length >= 5 && isActive === false) {
        alert("심볼은 최대 5개까지만 장착 가능합니다.");
      } else {
        https.put(`/api/v1/symbol/grant/${symbolNumber}`).then(() => {
          /* eslint no-restricted-globals: ["off"] */
          location.reload();
        });
      }
    }
  };

  const DIV_Hover = styled.div`
  transition: top 1s ease-in; // trasition 으로 top 이동시 자연스럽게 만들어 주자
  top: 20px; 		       // 호버메시지의 원래 위치 

  &.hover { 			// 호버시 추가되는 클래스
    top: 0px; 			// 호버시 top 위치를 조금 위로 움직여준다.
    animation-duration: 3s;  	// 애니메이션 3초동안 실행 
    animation-name: fadeout; 	// 애니메이션 효과는 fade-out
  }
  
  @keyframes fadeout { 		// fade-out시 opacity를 흐릿하다가 선명하기 만들자
    0% {
      opacity: 0; 
    }

    100% {
      opacity: 1;
    }
  }
`;

  return (
    <section className={classes.symbolCard}>
      <div
        className={`${
          isActive
            ? classes.imgBackground_active
            : classes.imgBackground_unactive
        }`}
      >
        {/* TODO: isActive를 획득여부로 교체해야함. */}
        <img
          src={symbolImgName}
          alt="symbolImgName"
          onClick={handleClick}
          onMouseEnter={() => setHover(key)} // 마우스엔터(호버)시 키값이 저장된다
          onMouseLeave={() => setHover('')}  // 마우스리브 시에는 키값이 지워진다
          className={`${
            isAcquired ? classes.symbolImage : classes.symbolImageInvalid
          }`}
        />
         <DIV_HoverInfo 
            className={`${hover !== '' ? 'hover' : 'none'}`} // 호버면 hover 클래스를 추가해주자
          >
            {hover === hoverMSG[key].id && ( // 호버 키값과 === 호버메시지의 id 값이 같으면
                <div className="hover-text"> // 호버메시지를 보여주자
                  {hoverMSG[key].text} 	     
                </div> 
            )}
          </DIV_HoverInfo>
      </div>
    </section>
  );
}

const isServer = typeof window == 'undefined';

export function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return('');
}

export function getTime(timeStamp = '') {
    const date = timeStamp ? new Date(timeStamp) : new Date();
    const year = date.getFullYear();
    const month = toDoubleNum(date.getMonth() + 1);
    const day = toDoubleNum(date.getDate());
    const hours = toDoubleNum(date.getHours());
    const minutes = toDoubleNum(date.getMinutes());
    const seconds = toDoubleNum(date.getSeconds());
    return {
        startOfDay: `${year}${month}${day} 000000`,
        endOfDay: `${year}${month}${day} 235959`,
        nowOfDay: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
        year, month, day, hours, minutes, seconds
    };
}

function toDoubleNum(num) {
    const strNum = String(num);
    return strNum.length === 1 ? `0${strNum}` : strNum;
}

export const Loading = {
    show() {
        if (!isServer) {
            let divEle = document.createElement('div');
            divEle.className = "div_loading_con"
            divEle.innerHTML = `
                <div class="iconfont div_loading">\ue64a</div>
            `
            document.body.appendChild(divEle);
        }
    },
    hide() {
        if (!isServer) {
            let divEle = document.querySelector('.div_loading_con');
            if (!!divEle) document.body.removeChild(divEle);
        }
    }
}
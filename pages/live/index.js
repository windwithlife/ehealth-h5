import React from 'react';
import "./index.less";
import InfoAdd from "./InfoAdd"
import { invoke_post } from "../../common/index"
import { Modal } from "antd-mobile";
import { judgeClient } from "../../common/tools";
import Countdown from 'react-countdown';




export default class Live extends React.Component {
  static async getInitialProps({ router }) {
    return { router };
  }
  constructor(props) {
    super(props);
    this.state = {
      whichTap: "LEFT", //LEFT | RIGHT
      initData: {},
      isShowInfoAdd: false,
      countdownTime: null,
    }
  }
  isShowInfoAddCall(value) {
    this.setState({ isShowInfoAdd: value })
  }
  async init() {
    try {
      let { query } = this.props.router;
      let data = await invoke_post('advertService/getLiveDetail', {
        id: query?.id
      }).then(result => result?.data)
      this.setState({ initData: data }, () => {
        this.loadPlayer(data);
      })
    } catch (error) {
      console.error('error: ', error);
    }
  }
  async componentDidMount() {
    this.init();
  }

  tapClick(whichTap) {
    this.setState({ whichTap })
  }
  androidLivePlay(data) {
    try {
      const { pullFlvUrl } = data;
      import("flv.js").then((flvjsData) => {
        let flvjs = flvjsData.default;
        console.log('flv.isSupported(): ', flvjs.isSupported(), pullFlvUrl);
        if (flvjs.isSupported()) {
          var videoElement = document.getElementById('videoElement');
          var flvPlayer = flvjs.createPlayer({
            type: "flv",
            url: pullFlvUrl,
          });
          flvPlayer.attachMediaElement(videoElement);
          flvPlayer.load();
          flvPlayer.play();
          flvPlayer.on('error', function (error) {
            console.error('flv_error: ', error);
          })
        } else {
          Modal.alert('提示', "设备不支持flv流媒体格式", [{ text: '确定', onPress: () => { } }])
        }
      })
    } catch (error) {
      console.error('error: ', error);
    }
  }
  iosLivePlay(data) {
    try {
      const { pullHlsUrl } = data;
      import("hls.js").then((hlsData) => {
        let Hls = hlsData.default;
        console.log('Hls.isSupported(): ', Hls.isSupported(), pullHlsUrl);
        let video = document.getElementById('videoElement');
        let videoSrc = pullHlsUrl;
        if (Hls.isSupported()) {
          let hls = new Hls();
          hls.loadSource(videoSrc);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = videoSrc;
          video.addEventListener('loadedmetadata', function () {
            video.play();
          });
        } else {
          Modal.alert('提示', "设备不支持hls流媒体格式", [{ text: '确定', onPress: () => { } }])
        }
      }).catch((error) => {
        console.error('hls——error: ', error);
      })
    } catch (error) {
      console.error('error: ', error);
    }
  }
  countdownComplete(){
    location.reload();
  }
  loadPlayer(data) {
    const { videoMp4Url, roomStatus, publishStatus, liveStartDate } = data;
    console.log('liveStartDate: ', liveStartDate);
    if (roomStatus == 1) {
      if (judgeClient() == "IOS") this.iosLivePlay(data);
      else this.androidLivePlay(data)
    } else if (roomStatus == 2 && publishStatus == 1) {
      let video = document.getElementById('videoElement');
      video.src = videoMp4Url;
    } else if (roomStatus == 0) {
      this.setState({ countdownTime: liveStartDate })
    }
  }


  render() {
    const { whichTap, initData, isShowInfoAdd, countdownTime } = this.state;

    const info_con_top_module = (
      <div className="info_con_top">
        <div className="info_con_title">
          {initData.roomTitle}
        </div>
        <div className="icon-shipin iconfont icon-shipin-style">
          &nbsp;{initData.playNumber}
        </div>
        <div className="live_status">
          {initData.roomStatus == 1 && "直播中"}
          {initData.roomStatus == 0 && `${initData.liveStartDate} 开播`}
          {initData.roomStatus == 2 && initData.playAble == 1 && initData.publishStatus == 0 && "直播结束，回放视频上传中"}
          {initData.roomStatus == 2 && initData.publishStatus == 1 && "直播结束，查看回放"}
        </div>
      </div>
    )
    let info_con_bottom_module = null;
    if (Object.keys(initData).length) {
      info_con_bottom_module = (
        <div className="info_con_bottom">
          <div className="info_con_tab">
            <div onClick={this.tapClick.bind(this, "LEFT")}
              style={whichTap == "LEFT" ? { borderBottom:"3px solid #1890ff",fontWeight:"bold" } : {}}
              className="info_con_bottom_left_tap tap">
              会议日程
            </div>
            <div onClick={this.tapClick.bind(this, "RIGHT")}
              style={whichTap == "RIGHT" ? { borderBottom:"3px solid #1890ff",fontWeight:"bold" } : {}}
              className="info_con_bottom_right_tap tap">
              会议介绍
            </div>
            <img className="desc_img" src={
              whichTap == "LEFT" ? initData.roomSchedulePath : initData.roomDescPath
            } />
          </div>
        </div>
      )
    }

    return (
      <div className="live_container">
        {
          !isShowInfoAdd && (
            <>
              <div className="video_con">
                <video id="videoElement" controls >
                  Your browser is too old which does not support HTML5 video.
                </video>
                {
                  !!countdownTime && (
                    <div className="count_down_con">
                      <div className="count_down_wrap">
                        <div>直播倒计时</div> 
                        <Countdown onComplete={this.countdownComplete.bind(this)} date={countdownTime}></Countdown>
                      </div>
                      
                    </div>
                  )
                }

              </div>
              <div className="info_con">
                {info_con_top_module}
                {info_con_bottom_module}
              </div>
            </>
          )
        }
        <InfoAdd isShowInfoAddCall={this.isShowInfoAddCall.bind(this)}></InfoAdd>
      </div>
    )
  }
}

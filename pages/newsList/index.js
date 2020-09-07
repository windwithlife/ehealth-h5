import React, { Component } from 'react';
import "./index.less";
import LinesEllipsis from 'react-lines-ellipsis';
import {invoke_post, doHref} from "../../common/index";

export default class newsList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listInfo: [],
		};
	}

	componentDidMount() {
		this.fetchApi();
	}

	async fetchApi () {
		let listInfo = await invoke_post('advertService/getInformationList', {}).then((result)=>result?.data);
		this.setState({
			listInfo: listInfo.informationList
		})
	}

	jumpUrl(item) {
		doHref(`newsDetail?id=${item.id}`);
	}

	render() {
		let { listInfo = [] } = this.state;
		return(
			<div className='container'>
				{/* 置顶卡片 */}
				{listInfo.length > 0 && !!listInfo[0] && <div className='topCard' onClick={()=> {this.jumpUrl(listInfo[0])}}>
					<img src={listInfo[0].advPicPath} className='topImg' />
					<div className='topTitle'>
						<LinesEllipsis text={listInfo[0].advTitle} maxLine="2" />
					</div>
					{/* <div className='topTag'>置顶</div> */}
				</div>}
				{/* 新闻样式1 纯文字 */}
				{/* <div className='newCard'>
					<div className='newCardTitle'>
						<LinesEllipsis text={'我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题'} maxLine="2" />
					</div>
					<div className='newCardTool'>
						<div className="newCardTag tagNew">最新</div>
						<div className="newCardDate">2020-08-26</div>
					</div>
				</div> */}
				{/* 新闻样式2 单图+文字 */}
				{listInfo.length > 0 && listInfo.map((v, k) => {
					if (k > 0) {
						return (
							<div key={k} className='newCard' onClick={()=> {this.jumpUrl(v)}}>
								{!!v.advPicPath && <div className='newCardImgContainer'><img src={v.advPicPath} className='newCardImg' /></div>}
								<div className='newCardTitle'>
									<LinesEllipsis text={v.advTitle} maxLine="2" />
								</div>
								<div className='newCardTool'>
									{/* <div className="newCardTag tagHot">最热</div> */}
									{/* <div className="newCardDate">2020-08-26</div> */}
								</div>
							</div>
						);
					}
				})}
				{/* 新闻样式3 多图+文字 */}
				{/* <div className='newCard'>
					<div className='newCardImgList'>
						<img className='newCardImgItem' />
						<img className='newCardImgItem' />
						<img className='newCardImgItem' />
					</div>
					<div className='newCardTitle'>
						<LinesEllipsis text={'我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题我是标题'} maxLine="2" />
					</div>
					<div className='newCardTool'>
						<div className="newCardTag tagCustom">通用</div>
						<div className="newCardDate">2020-08-26</div>
					</div>
				</div> */}
			</div>
		)
	}
}
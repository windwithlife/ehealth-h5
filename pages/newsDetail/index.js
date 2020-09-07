import React, { Component } from 'react';
import "./index.less";
import LinesEllipsis from 'react-lines-ellipsis';
import {invoke_post} from "../../common/index";

export default class newsDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			detailInfo: {}
		};
	}

	static async getInitialProps({router}) {
		return { router };
	}

	componentDidMount() {
		this.fetchApi();
	}

	async fetchApi() {
		let { query } = this.props.router;
		let detailInfo = await invoke_post('advertService/getInformationDetail', {
			id: query?.id
		}).then((result)=>result?.data);
		this.setState({
			detailInfo: detailInfo
		})
	}

	render() {
		let { detailInfo } = this.state;
		return(
			<div className='container'>
				<div className='title'>{detailInfo.advTitle}</div>
				{/* <div className='toolbar'>
					<div className='tag tagTop'>置顶</div>
					<div className='date'>2020-08-26</div>
				</div> */}
				{/* <div className='content'>
					&nbsp;&nbsp;&nbsp;&nbsp;我是正文我是正文我是正文我是正文我是正文我是正文我是正文我是正文我是正文我是正文<br/><br/>
				</div> */}
				<div className='content'>
					{!!detailInfo.advPicPath && <div className="contentImgContainer"><img src={detailInfo.advPicPath} className="contentImg" /></div>}
 					<div className='contentDetail' dangerouslySetInnerHTML={{__html: detailInfo.advDesc}}/>
				</div>
				<a className='link' href='https://www.baidu.com/'>会议视频地址</a>
			</div>
		)
	}
}
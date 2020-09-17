import React, { Component } from 'react';
import "./index.less";
import LinesEllipsis from 'react-lines-ellipsis';
import { Carousel, WingBlank } from "antd-mobile";
import { invoke_post, doHref } from "../../common/index";

export default class newsList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listInfo: [],
			carouselDescIdx:0,
		};
	}
	carouselAfterChange(idx) {
		this.setState({
			carouselDescIdx:idx
		})
	}
	componentDidMount() {
		this.fetchApi();
	}

	async fetchApi() {
		let listInfo = await invoke_post('advertService/getInformationList', {}).then((result) => result?.data);
		this.setState({
			listInfo: listInfo.informationList
		})
	}

	jumpUrl(item) {
		doHref(`newsDetail?id=${item.id}`);
	}

	render() {
		let { listInfo = [], carouselDescIdx} = this.state;
		let carouselDescObj = listInfo[carouselDescIdx];

		return (
			<div className='news_list_container'>
				<div className="news_list_carousel_con">
					<Carousel autoplay={true} infinite autoplayInterval={2000} afterChange={this.carouselAfterChange.bind(this)}>
						{listInfo.slice(0, 2).map((item, idx) => {
							return (
								<div className="swiper_con" key={idx} onClick={() => this.jumpUrl(item)}>
									<img src={item.advPicPath} />
								</div>
							)
						})}
					</Carousel>
				</div>
				<div className="news_list_news_con" onClick={() => this.jumpUrl(carouselDescObj)}>
					<div className="news_list_news_ele">
						<div className="news_list_news_ele_title">
							<LinesEllipsis text={carouselDescObj?.advTitle} maxLine="2" />
						</div>
						<div className="news_list_news_ele_desc">
							{!!carouselDescObj?.clickNumber && <div className="news_list_news_ele_desc_read">{carouselDescObj?.clickNumber} 阅读</div>}
							{/* <div>30 分钟前</div> */}
						</div>
					</div>
				</div>

				{
					listInfo.slice(2).map((item, idx) => {
						return (
							<div className="news_list_news_con_list" key={idx} onClick={() => this.jumpUrl(item)}>
								<div className="news_list_news_con_list_left">
									<div className="news_list_news_ele_title">
										<LinesEllipsis text={item.advTitle} maxLine="2" />
									</div>
									<div className="news_list_news_ele_desc">
										{!!item.clickNumber && <div className="news_list_news_ele_desc_read">{item.clickNumber} 阅读</div>}
										{/* <div>30 分钟前</div> */}
									</div>
								</div>
								<div className="news_list_news_con_list_right">
									<img src={item.advPicPath} />
								</div>
							</div>
						)
					})
				}
			</div>
		)
	}
}
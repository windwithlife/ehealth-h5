const { Carousel, WingBlank } = window["antd-mobile"];

class App extends React.Component {
  state = {
    data: ['1', '2', '3'],
    imgHeight: 176,
  }
  componentDidMount() {
    // simulate img loading
    setTimeout(() => {
      this.setState({
        data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
      });
    }, 100);
  }
  render() {
    return (
      <WingBlank>
        <Carousel autoplay={false} infinite>
          {[1,2,3,4].map(val => (
                <img src={`https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1785268159,4255602266&fm=26&gp=0.jpg`}/ >
          ))}
        </Carousel>
      </WingBlank>
    );
  }
}

ReactDOM.render(<App />, mountNode);
import React, { Component } from 'react';
// import logo from './logo.svg';
import { SearchBar, List, Modal, ListView } from 'antd-mobile';
import axios from 'axios';
// import '../Mock/mock';
import { PropTypes } from 'prop-types';
import { hashHistory } from 'react-router';
const Item = List.Item;
const Brief = Item.Brief;

const alert = Modal.alert;








// const NUM_ROWS = 1;
let pageIndex = 0;
let searchValue;

function genData(pIndex, rows) {
    const dataBlob = {};
    for (let i = 0; i < rows; i++) {
        const ii = (pIndex * 20) + i;
        dataBlob[`${ii}`] = `row - ${ii}`;
    }
    return dataBlob;
}

class QueryPage extends Component {

    constructor(props) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource,
            bookdata: [],
            searchbookname: "",
            isLoading: false,
            hasMore: true
        }

    }

    componentWillMount() {
        // if (localStorage.getItem('goback') === "goback") {
        //     localStorage.removeItem("goback")
        //     hashHistory.goBack();
        //     return;
        // }
    }



    componentDidMount() {

        if (localStorage.getItem('goback') === "goback") {
            localStorage.removeItem("goback")
            hashHistory.goBack();
            return;
        }
        let searchbookname = localStorage.getItem("searchbookname");
        if (searchbookname !== "null" && searchbookname !== undefined && searchbookname !== null) {

            localStorage.removeItem("searchbookname")
            this.handleClick(searchbookname)
            this.setState({
                searchbookname: searchbookname
            })

        }else{
            this.handleClick("");
        }


     

    }
    handleClick = (value) => {
        localStorage.setItem('searchbookname', value);
        // console.log(value);
        console.log(localStorage.getItem("searchbookname"));
        searchValue = value;
        // this.setState({
        //     searchbookname: value
        // })
        pageIndex = 0;

        axios.get('/borrowservice/getbook?bookname=' + value + '&pageindex=0').then(res => {

            if (res.data == null) {
                alert("抱歉，无相关书籍！")
                return
            }

            if(res.data.Code === "004" || res.data.Code === "007"){
                alert("加载错误")
                return
            }

            this.setState({ bookdata: res.data })



            this.rData = genData(0, res.data.length);
            console.log(this.rData)
            // this.setState({
            //     dataSource
            // })
            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            console.log(this.state.dataSource)
            this.setState({
                dataSource: ds.cloneWithRows(this.rData),
                // isLoading: false,

            });
            if (res.data.length < 20) {
                this.setState({
                    hasMore: false
                })
            }else{
                this.setState({
                    hasMore:true
                })
            }



        }).catch(error => {
            console.log(error)
        })

    }
    gotoBorrowPage = (booknumber, bookstatus, bookname) => {
        console.log(booknumber)
        if (bookstatus === 0) {

            axios.get('/borrowservice/borrowinfo?booknumber=' + booknumber).then(res => {


                console.log(res.data);
                if(res.data.Code === "023"){
                    alert("查询书失败！")
                    return
                }
                alert("抱歉该书已被" + res.data.Username + "于" + res.data.Createtime + "借走")
              


            }).catch(error => {
                console.log(error)
            })

        } else {
            this.context.router.push({
                pathname: '/borrowpage',
                state: {
                    booknumber: booknumber,
                    bookname: bookname
                }
            })
        }

    }


    onChange = (value) => {
        this.setState({
            searchbookname: value
        })
    }

    onEndReached = (event) => {


        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        // if (this.state.isLoading && !this.state.hasMore) {
        //     return;
        // }
        console.log('reach end', event, this.state.isLoading, this.state.hasMore);
        if(!this.state.hasMore){
            alert("抱歉，无更多书籍！")
            return;
        }
        if (this.state.isLoading || !this.state.hasMore) {
            console.log("return", this.state.isLoading)
            return;
        }
        

        this.setState({ isLoading: true });

        ++pageIndex;

        axios.get('/borrowservice/getbook?bookname=' + searchValue + '&pageindex=' + pageIndex).then(res => {



            if (res.data == null) {
                alert("抱歉，无更多书籍！")
                this.setState({
                    isLoading: false
                })
                --pageIndex;
                return
            }

            if(res.data.Code === "004" || res.data.Code === "007"){
                alert("加载错误")
                --pageIndex;
                this.setState({
                    isLoading: false
                })
                return;
            }

            if(res.data.length < 20){
                this.setState({
                    hasMore:false
                })
                // --pageIndex;
            }

            this.setState({ bookdata: res.data })
            console.log(genData(pageIndex, 20));
            this.rData = { ...this.rData, ...genData(pageIndex, res.data.length) };
            console.log(this.rData)

            console.log(this.state.dataSource)
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                isLoading: false
            });
        
            console.log(this.state.dataSource)


        }).catch(error => {
            console.log(error)
        })



    }
    render() {

        // const newList = data => data.map((item) => {
        //     return <Item key={item.Booknumber} arrow="horizontal" multipleLine onClick={() => this.gotoBorrowPage(item.Booknumber)} extra={item.Booknumber}>{item.Bookname} <Brief>{item.Author}</Brief></Item>

        // })

        const { bookdata, dataSource } = this.state;
        let index = 0

        const row = (rowData, sectionID, rowID) => {
            if (index >= bookdata.length) {
                return (<Item />);
            }
            const obj = bookdata[index++];
            return (
                // <div>{obj.Booknumber}</div>
                <Item key={obj.Booknumber} arrow="horizontal" multipleLine onClick={() => this.gotoBorrowPage(obj.Booknumber, obj.Bookstatus, obj.Bookname)} extra={obj.Bookstatus === 0 ? "已借" : ""}>{obj.Bookname} <Brief>{obj.Booknumber}</Brief></Item>
            );
        };


        return (

            <div>
                {/* <p>查询书籍</p> */}
                {/* <br/> */}
                {/* <br/> */}
                <SearchBar value={this.state.searchbookname} onChange={this.onChange} placeholder="输入书名进行查询" maxLength={8} onSubmit={(value) => this.handleClick(value)} />
                <ListView
                    renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                        {this.state.isLoading ? 'Loading...' : ''}
                    </div>)}
                    dataSource={dataSource}
                    scrollRenderAheadDistance={500}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
                    renderRow={row}
                    pageSize={4}
                    useBodyScroll
                    onScroll={() => { console.log('scroll'); }} />


                {/* {newList(bookdata)} */}
                {/* </ListView> */}


            </div>
        );
    }
}
QueryPage.contextTypes = { router: PropTypes.object.isRequired };
export default QueryPage;

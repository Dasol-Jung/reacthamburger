import React, {Component} from 'react';
import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toobar'
import SideDrawer from '../Navigation/SideDrawer/SideDrawer'
// I used Fragment instead of Aux. Check this out.

class Layout extends Component{

    state={
        showSideDrawer : false
    }

    sideDrawerClosedHandler = ()=>{
        this.setState({
            showSideDrawer : false
        })
    }

    sideDrawerToggleHandler =()=>{
        this.setState(
            prevState=>{
        return {showSideDrawer : !prevState.showSideDrawer};
            })
            }
            
    render(){

        return(
            <React.Fragment>
            <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
            <SideDrawer open ={this.state.showSideDrawer} closed={this.sideDrawerClosedHandler} />
            <main className={classes.Content}>
                {this.props.children}
            </main>
            </React.Fragment>
        )
    }

}



export default Layout;
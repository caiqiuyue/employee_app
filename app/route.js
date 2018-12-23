import { StackNavigator, SwitchNavigator } from 'react-navigation';
import WelcomePage from './main/WelcomePage';
import Home from './main/Tab/tab';
import Login from './main/Login/Login';
import LeaseInfo from './MyHome/HomePage/leaseInfo';
import DataReference from './MyHome/HomePage/dataReference';
import Preferential from './MyHome/Mine/preferential';
import SearchRoom from './MyHome/Mine/searchRoom';
import MeterReading from './MyHome/Mine/meterReading';



const SimpleApp = StackNavigator({

    LeaseInfo:{
        screen: LeaseInfo,
        navigationOptions: {
            headerTitle:'查看合约',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#0074c3'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    MeterReading:{
        screen: MeterReading,
        navigationOptions: {
            headerTitle:'抄表',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#0074c3'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    SearchRoom:{
        screen: SearchRoom,
        navigationOptions: {
            headerTitle:'移动查房',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#0074c3'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    DataReference:{
        screen: DataReference,
        navigationOptions: {
            headerTitle:'数据参谋',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#0074c3'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    Preferential:{
        screen: Preferential,
        navigationOptions: {
            headerTitle:'优惠券发放',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#0074c3'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    Home: {
        screen: Home,
        navigationOptions: {
            header: null,
        }
    },


},{
    initialRouteName: 'Home'
});

const WelcomeHome = StackNavigator({
    WelcomePage:{
        screen: WelcomePage,
        navigationOptions: {
            header: null,
        }
    }
});

const LoginHome = StackNavigator({
    Login:{
        screen: Login,
        navigationOptions: {
            header: null,
        }
    },

});


export default SwitchNavigator(
    {
        WelcomeHome: WelcomeHome,
        SimpleApp: SimpleApp,
        LoginHome: LoginHome
    },
    {
        initialRouteName: 'WelcomeHome',
    }
);

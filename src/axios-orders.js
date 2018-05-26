import axios from 'axios'

const instance= axios.create({
    baseURL : "https://react-my-burger-bb7cc.firebaseio.com/"
});

export default instance;
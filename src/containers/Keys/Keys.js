import React,{Component} from 'react';
import axios from '../../axios';
import {connect} from 'react-redux';

import Key from './Key/Key';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import { fetchUserData } from '../../store/actions/auth';

class Keys extends Component{

    state = {
        keys: null,
        error: null
    }

    componentDidMount(){
        axios.get('/keys').then(response => {
            this.setState({keys: response.data.keys});
        }).catch(err => {
            this.setState({error: err});
        });
    }

    keyBoughtHandler = (id) => {
        const body = { "key":id }
        axios.post('/keys/buy', body, {headers:{
            "x-auth": this.props.token
        }}).then(response => {
            this.props.onFetchUser(this.props.token);
        }).catch(err => {
            this.setState({error: err.response.data.message});
        })
    }

    render(){
        let keys = null;
        if(this.state.keys){
            keys = this.state.keys.map(key => {
                return <Key 
                    key={key._id}
                    id={key._id}
                    name={key.name}
                    description={key.description}
                    price={key.price}
                    quantity={key.quantity}
                    buyKey={(id) => {this.keyBoughtHandler(id)}}
                />
            });

            if(keys.length === 0){
                keys = <h5>Não possuímos chaves no momento, tente novamente mais tarde.</h5>
            }
        }
        let keysQuantity = null;
        if(this.props.user){
            keysQuantity = <h2>Você tem {this.props.user.keys} chaves</h2>
        }
        return (
            <Aux>
                <p>{this.state.error? this.state.error : null}</p>
                {keysQuantity}
                {keys}
            </Aux>
        )
    }

}

const mapStateToProps = state => {
    return {
        token: state.auth.token,
        user: state.auth.user
    }
}

const mapActionsToProps = dispatch => {
    return{
        onFetchUser: (token) => dispatch(fetchUserData(token))
    }
}

export default connect(mapStateToProps, mapActionsToProps)(Keys);
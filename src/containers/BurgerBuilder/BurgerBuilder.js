import React,{ Component } from 'react'
import Burger from '../../components/Burger/Burger'
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import { encode } from 'punycode';
const INGREDIENTS_PRICE ={salad : 0.5, cheese : 0.4, meat : 1.3, bacon : 0.7};

class BurgerBuilder extends Component{

    state ={
        ingredients:null,
        totalPrice : 4,
        purchasable : false,
        purchasing : false,
        loading : false,
        error : false
    }

    componentDidMount(){
        console.log(this.props.match)
        axios.get("/ingredients.json")
            .then(response=>{
                this.setState({ingredients : {...response.data}})
            })
            .catch(error=>{
                this.setState({error:true})
            })
    }


    purchaseHandler= ()=>{
        this.setState({
            purchasing : true
        })
    }

    closeModal = ()=>{
        this.setState({
            purchasing : false
        })
    }

    purchaseContinueHandler = ()=>{
        
        const queryParams =[];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i)+'='+ encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price='+this.state.totalPrice)
        const queryString= queryParams.join("&");
        this.props.history.push({
            pathname : '/checkout',
            search : '?' + queryString
        });
    }

    updatePurchaseState (ingredients){
        
        const sum = Object.keys(ingredients)
        .map(igKey=>{
            return ingredients[igKey];
        })
        .reduce((total,el)=>total+el,0);

        this.setState({
            purchasable : sum > 0
        })
    }

    addIngredientHandler = (type)=>{
        const oldCount= this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENTS_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({

            totalPrice : newPrice,
            ingredients : updatedIngredients          

        })
        this.updatePurchaseState(updatedIngredients);

    }

    removeIngredientHandler = (type)=>{
        const oldCount= this.state.ingredients[type];
        if(oldCount<=0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {...this.state.ingredients};
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENTS_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({

            totalPrice : newPrice,
            ingredients : updatedIngredients          

        })
        this.updatePurchaseState(updatedIngredients);
    }

    render(){

        const disabledInfo ={
            ...this.state.ingredients
        };

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key]<=0;
        }

        let orderSummary = null;

        let burger = this.state.error ? <p>Ingredients can't be loaded</p>: <Spinner/>

        if(this.state.ingredients){

        burger =(
        <React.Fragment>
        <Burger ingredients={this.state.ingredients}/>
        <BuildControls
        ingredientAdded={this.addIngredientHandler}
        ingredientRemoved={this.removeIngredientHandler}
        disabled={disabledInfo}
        purchasable ={this.state.purchasable}
        price={this.state.totalPrice}
        ordered={this.purchaseHandler}/>
        </React.Fragment>);

        orderSummary=
        (<OrderSummary
        price={this.state.totalPrice}
        purchaseCanceled={this.closeModal}
        purchaseContinued = {this.purchaseContinueHandler}
        ingredients={this.state.ingredients}/>);
        }

        if (this.state.loading){
            orderSummary = <Spinner/>
        }

        

        return (
            <React.Fragment>
                <Modal
                modalClosed={this.closeModal}
                show={this.state.purchasing}>
                    {orderSummary}
                </Modal>
                {burger}
            </React.Fragment>
        );

    }
}

export default withErrorHandler(BurgerBuilder,axios);
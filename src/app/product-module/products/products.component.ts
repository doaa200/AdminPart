import { AfterViewInit, Component, EventEmitter, Input, IterableDiffers, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IProduct } from '../../ViewModel/iproduct';
import {ICategory} from '../../ViewModel/icategory';
import { isNgTemplate } from '@angular/compiler';
import { ShoppingCartItems } from '../../ViewModel/ShoppingCartItems';
import { ProductsService } from '../../Services/products.service';
import { ProductAPIService } from '../../Services/ProductAPI/product-api.service';
import { CartAPIServiceService } from 'src/app/Services/Cart/cart-apiservice.service';

import {NgToastService} from 'ng-angular-popup'
import { ProductCartService } from 'src/app/Services/product-cart.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnChanges,AfterViewInit {
   selectedCatID:number=1;
   IsPurshased:boolean=true;
   idNumber:string="";
  Credit_Card:number=0;
   categroy:ICategory[]=[];
   ProductFilteration:IProduct[]=[];
   quantity:number=1;
   ClientName:string="";
  
  selectdate:Date=new Date();


  @Input()ReciveCatId:number=0;
  OrderTotalPrice:number=0;

  ProductListOfCategory:IProduct[]=[];


  @Output() BuyDone: EventEmitter<ShoppingCartItems>;
  Prodlist:any;
  Cart:ShoppingCartItems[]=[];
environment:string=`${environment.APIUEL}/Resources/Images/`;
cartlist:IProduct[]=[];
  
  prodtitem:IProduct={
    id:0,
    name:'',
    price:0,
    quantity:0,
    catID:0,
    image:""
  }
 
  constructor(
    public Prdservice:ProductsService,
    private prdApiservice:ProductAPIService,
    private CartAPIService:CartAPIServiceService,
    private toast :NgToastService,
    private productcart:ProductCartService) {
      console.log(this.environment);


  this.BuyDone= new EventEmitter<ShoppingCartItems>();

  
  }
  ngAfterViewInit(): void {

  }




  ngOnChanges(changes: SimpleChanges): void {

    this.prdApiservice.getProductsByCatID(this.ReciveCatId)
    .subscribe(Prdlist=>{this.ProductListOfCategory=Prdlist;
 
    });

    
  }

  ngOnInit(): void {

  this.productcart.sharedValue.next(this.quantity)
  console.log(this.quantity);

    this.prdApiservice.getAllProducts().subscribe(Prdlist=>{
      this.ProductListOfCategory=Prdlist;
      

    });

    
  }

  Price(itemcount:number,Price:number){
    this.OrderTotalPrice+=(itemcount*Price)

  }


  Buy(item:IProduct,Quantity:number){
    this.Cart[item.id]={
      ProductId:item.id,
      ProductName:item.name,
      SelectedQuantity:Quantity,
      UnitPrice:item.price

    }
    this.BuyDone.emit(this.Cart[item.id])
  }
AddToCart(item:any,quantity:any){

this.CartAPIService.AddTOCart(item)
this.quantity=quantity.value;



this.productcart.sharedValue.next(this.quantity )
this.cartlist.push(item)


console.log(this.quantity);




}
DeleteProduct(id:number){
  this.prdApiservice.deleteproduct(id).subscribe(
    response=>{

      this.toast.success({detail:"Deleted Success " ,duration:5000})

    }
  );

} 


EditProduct(item:IProduct){



}


createimgpath=(serverpath:string)=> {
return `https://localhost:44386/${serverpath}`
}

}



import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from 'src/app/modules/product/models/cart-item';
import { Product } from 'src/app/modules/product/models/product.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AddToCartService {
  private apiURL: string;
  //private baseUrl = 'http://localhost:3000';
  counter:number;

  constructor(private http: HttpClient) {
    this.apiURL = environment.apiUrl;
    this.counter=0;
   }

   // BehaviorSubject to track cart items
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();


   // Use a BehaviorSubject to keep track of the cart item count
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCountSubject.asObservable();

  // Update the cart count
  updateCartItemCount(count: number) {
    this.cartItemCountSubject.next(count);
  }


    //add the product to cart
  // addProductToCart(data: any) {
  //   const addToCartUrl = `${this.apiURL}/addToCart`;
  //   return this.http.post<any[]>(addToCartUrl, data)
  // }

   //get the productfromcart
   getProductFromCart() {
    const addToCartUrl = `${this.apiURL}/addToCart`;
    return this.http.get<any[]>(addToCartUrl)
  }
  
  //get the productfromcart
  getProductFromCartById(id:any){
    const addToCartUrl = `${this.apiURL}/addToCart/${id}`;
    return this.http.get<any[]>(addToCartUrl)
  }

  //edit cart details
  editCartDetails(data:any){ 
    const addToCartUrl = `${this.apiURL}/addToCart/${data[0].id}`;
    return this.http.put<any[]>(addToCartUrl, data[0])
  }

  //remove from cart details
  deleteCartDetails(id:any){    
    const addToCartUrl = `${this.apiURL}/addToCart/${id}`;
    return this.http.delete<any[]>(addToCartUrl,id)
  }

  deleteCart(){    
    const addToCartUrl = `${this.apiURL}/addToCart`;
    return this.http.delete<any[]>(addToCartUrl)
  }

  // API
  getCartItemsByUserId(idAccount: number): Observable<any[]> {
    const url = environment.apiUrl+`api/Cart/${idAccount}`;
    return this.http.get<any[]>(url);
  }

  getAllDelModes(): Observable<any[]> {
    const url = environment.apiUrl+`api/Cart/GetDeliveryModes`;
    return this.http.get<any[]>(url);
  }

  addProductToCart1(idAccount: number, cartItem: CartItem): Observable<CartItem> {
    const url = environment.apiUrl+`api/Cart/AddProductToCart/${idAccount}`;
    return this.http.post<CartItem>(url, cartItem);
  }

  removeProductFromCart(idAccount: number, cartItemId: number): Observable<any> {
    const url =
      environment.apiUrl + `api/Cart/RemoveProductFromCart/${idAccount}/${cartItemId}`;
    return this.http.delete<any>(url);
  }

  emptyCart(idAccount: number, cartId: number): Observable<any> {
    const url = environment.apiUrl+`api/Cart/EmptyCart/${idAccount}/${cartId}`;
    return this.http.delete(url);
  }

  updateCartItemQuantity(cartItemId: number, newQuantity: number): Observable<any> {
    return this.http.put(
      this.apiURL + `api/Cart/updateCartItemQuantity/${cartItemId}/${newQuantity}`, cartItemId);
  }
  
  // Update cart items and emit the change to subscribers
  updateCartItems(cartItems: any[]): void {
    this.cartItemsSubject.next(cartItems);
  }

  // Refresh cart items from the server and update subscribers
  refreshCartItems(idAccount: number): void {
    this.getCartItemsByUserId(idAccount).subscribe((cartItems: any[]) => {
      this.updateCartItems(cartItems); // Emit the updated cart
      this.updateCartItemCount(cartItems.length); // Update the cart count
    });
  }
}
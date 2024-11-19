import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";

export class Utils {
  public static handleError(error: HttpErrorResponse) {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      let msg = "Unknown error";
      if (error.error && typeof error.error === 'string') {
        msg = <string>error.error;
      }
      else if (error.message) {
        msg = error.message;
      }
      errorMessage = `Backend returned code ${error.status}, ${error.error}`;
    }

    console.error(errorMessage);
    return throwError(errorMessage);
  };

}

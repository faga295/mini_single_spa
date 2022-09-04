import { Application } from '../types/application';
import { NOT_MOUNTED } from '../applications/app.helper';
export function toUnloadPromise(app:Application){
    app.status = NOT_MOUNTED
}
// function finishUnloadingApp(app:Application){
//     delete apps
// }
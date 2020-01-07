
//tooltup plugin
import { addClass, removeClass } from './helpers';

let mouseOverHandler = function(event) {
    let span = event.target.parentNode.getElementsByTagName('SPAN')[0]; //get first span within target element's parent
    addClass(span, 'tooltip-show');
};

let mouseOutHandler = function(event) {
    let span = event.target.parentNode.getElementsByTagName('SPAN')[0]; //get first span within target element's parent 
    removeClass(span, 'tooltip-show');
};

export default {
    //to make plugin work it needs to have an install function to which we pass in the Vue instance
    install(Vue)
    {        
        //define a custom "v-tooltip" directive. Attaches a <span> that shows/hides in response to mouse events.
        Vue.directive('tooltip', {
        
            //following lifecycle function executes when directive first bound to element.
            bind(el, bindings) {
                let span = document.createElement('SPAN');
                let text = document.createTextNode(`Seats available:${bindings.value.seats}`);
                span.appendChild(text); //insert text inside span
                addClass(span, 'tooltip');
                el.appendChild(span); //insert span inside incoming element
        
                //attach mouse event listeners to div (for non-mobile devices)
                let div = el.getElementsByTagName('DIV')[0]; //get first div inside incoming element
                div.addEventListener('mouseover', mouseOverHandler);
                div.addEventListener('mouseout', mouseOutHandler);
        
                //attach touch event listeners to div (for mobile devices)
                div.addEventListener('touchstart', mouseOverHandler);
                div.addEventListener('touchend', mouseOutHandler);
        
            },
            unbind(el) {
                //free up resources by removing event listeners (when tooltip element removed from DOM?)
                let div = el.getElementsByTagName('DIV')[0]; //get first div inside incoming element
                div.removeEventListener('mouseover', mouseOverHandler);
                div.removeEventListener('mouseout', mouseOutHandler);
                div.removeEventListener('touchstart', mouseOverHandler);
                div.removeEventListener('touchend', mouseOutHandler);
            }
            
        });
    }

}


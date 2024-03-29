class Store {
    public observers: Function[];

    constructor() {
        this.observers = [];
    }

    public subscribe(fn) {
        this.observers.push(fn);
    }

    public broadcast() {
        if (this.observers.length === 0) {
            //console.log("No subsricer in Array");
        } else {
            this.observers.forEach(subscriber => subscriber());
        }
    }

    public unsubscribe(fn) {
        this.observers = this.observers.filter(subscriber => subscriber == fn);
        console.log(this.observers);
    }
}
if (window["store"] === undefined) {
    window["store"] = new Store();
}

export default (window["store"] as Store);
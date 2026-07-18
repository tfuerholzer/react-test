import {BehaviorSubject, merge, Observable, of, shareReplay, Subject, switchMap} from "rxjs";

export const INITIAL_TOKEN = Symbol("INITIAL_TOKEN");
export const LOADING_TOKEN = Symbol("LOADING_TOKEN");

type InitialState = typeof INITIAL_TOKEN
type LoadingState = typeof LOADING_TOKEN


class ParameterCarrier<Parameter> {
    constructor(public readonly params: Parameter) {
    }
}

export class RemoteResource<Parameter, ExpectedReturn>{
    public get value$():  Observable<ExpectedReturn | InitialState | LoadingState | Error>{
        if (this.resultObservable$ !== undefined){
            return this.resultObservable$;
        }
        this.resultObservable$ = this.buildResultObservable()
        return this.resultObservable$
    }
    private readonly internalSubject = new Subject<ParameterCarrier<Parameter>>();
    private resultObservable$? : Observable<ExpectedReturn | InitialState | LoadingState>;
    
    constructor(public readonly requestFactory: (parameter : Parameter) => Observable<ExpectedReturn>) {}
    
    public dispatch(param : Parameter) {
        this.internalSubject.next(new ParameterCarrier(param));
    }
    
    private buildResultObservable(){
        return merge(of(INITIAL_TOKEN), this.internalSubject)
            .pipe(switchMap(it => it instanceof ParameterCarrier ? this.executeRequest(it.params) : of(it)), shareReplay(1))
    }
    
    private executeRequest(params : Parameter) : Observable<ExpectedReturn | LoadingState>{
        const request = this.requestFactory(params)
        return merge(of(LOADING_TOKEN), request)
    }
}
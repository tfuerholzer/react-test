import React, {CSSProperties, JSX, useEffect, useRef, useState} from 'react';
import {INITIAL_TOKEN, LOADING_TOKEN, RemoteResource} from "./RemoteResource";
import {delay, from, tap, throwError} from "rxjs";


function calculateColor(count: number): CSSProperties['color'] {
    const redValue = count < 255 ? count : 255;
    return `rgb(${redValue}, 0, 10)`;
}

async function loadPokemon(name: string | number): Promise<object> {
    try {
        const result = await fetch('https://pokeapi.co/api/v2/pokemon/' + name)
        const obj = await result.json();
        return obj
    } catch (e) {
        console.error(e);
        throw e
    }
}

function Pokemon(params: { pokemon: any, pokemonClicked?: () => any }) {
    if (typeof params.pokemon === 'symbol' && params.pokemon === INITIAL_TOKEN) {
        return <div>Enter something ...</div>;
    } else if (typeof params.pokemon === 'symbol' && params.pokemon === LOADING_TOKEN) {
        return <div>LOADING ...</div>;
    } else {
        const props = ['name', 'id', 'height', 'base_experience', 'weight']
        return (
            <div onClick={() => params.pokemonClicked !== undefined ? params.pokemonClicked() : {}}>
                <PropertyRender object={params.pokemon} props={props}></PropertyRender>
            </div>
        )
    }
}

function PropertyRender<Obj>(params: { object: Obj, props: (keyof Obj)[] }) {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
        {params.props.map(it => (<>
            <div key={propertyName(it)}>{`${propertyName(it)}`}</div>
            <div>{propertyValue(params.object[it])}</div>
        </>))}
    </div>
}

function propertyName(it: string | symbol | number): string {
    const result = it === 'symbol' ? '' : `${it}`
    return result
}

function propertyValue(it: any) {
    return it === null || it === undefined ? 'unknown' : `${it}`
}

function getNextId(pokemon: any) {
    if (typeof pokemon !== 'object') {

    }
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(p: { children: React.ReactNode }) {
        super(p);
        this.state = {hasError: false};
    }


    override componentDidCatch(error: any, errorInfo: any) {
        console.error("Error logged:", error, errorInfo); // Log error details
        this.setState({hasError: true});
    }

    override render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>; // Fallback UI
        }
        return this.props.children;
    }
}

const rr = new RemoteResource((name: string | number) => from(loadPokemon(name)).pipe(delay(500)))

export function App() {
    return <ErrorBoundary>
        <PokemonApp></PokemonApp>
    </ErrorBoundary>
}

export function PokemonApp() {
    const [pokemon, setPokemon] = useState<any>(INITIAL_TOKEN)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const sub = rr.value$.pipe(tap(console.log)).subscribe({
            next: setPokemon,
            error: it => {
                throw it
            }
        })
        return () => sub.unsubscribe()
    })

    useEffect(() => {
        if (search.length === 0) {
            return
        }
        rr.dispatch(search)
    }, [search]);

    const dispatchNext = () => {
        if (typeof pokemon !== 'object') {
            return
        }
        const id = pokemon.id
        rr.dispatch(id + 1)
    }

    if (search === 'text') {
        throw new Error(`God damn something went wrong`)
    }

    return <div>
        <input type={'text'} value={search} onChange={(e) => setSearch(e.target.value)}/>
        <br/>
        <Pokemon pokemon={pokemon} pokemonClicked={() => dispatchNext()}></Pokemon>
    </div>
}
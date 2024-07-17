import React, {useState} from "react";
import Gelato from "./Gelato";
import axios from "axios";
const url = "https://react--course-api.herokuapp.com/api/v1/data/gelateria";
const h4Style = {textAlign:"center", textTransform: "uppercase"};

const Menu = () => {
    //Settaggio dello state
    const [isLoading,setIsLoading] = useState(true);

    //Controllo degli errori di caricamento
    const [isError,setIsError] = useState(false);

    //I dati che ottengo dall'api
    const [prodotti,setProdotti] = useState();

    //Prodotti filtrati senza alterare l'intera lista di prodotti
    const [prodottiFiltrati, setProdottiFiltrati] = useState();

    //Il primo valore di categoria sarà "ALL"
    const [selected,setSelected] = useState(0);

    //Categorie di prodotti offerti
    const [categorie,setCategorie] = useState([]);

    //Filtro i prodotti e modifico il valore di selected
    const filtraProdotti = (categoria,index) => {
        setSelected(index);

        //Se indico ALL ripristino allo stato iniziale
        if(categoria === "all"){
            setProdottiFiltrati(prodotti);
        }//Altrimenti utilizzo il metodo filter
        else{
            const prodottiFiltrati = prodotti.filter((el) => el.categoria === categoria ? el : "");
            setProdottiFiltrati(prodottiFiltrati);
        }
    };

    React.useEffect(() => {
        //Funzione Invocata Immediatamente
        (async () => {
          //Reimposto valori allo stato inziale prima di incominciare data fetching
          setIsLoading(true);
          setIsError(false);
          try {
            const response = await axios.get(url);
            setProdotti(response.data.data);
            setProdottiFiltrati(response.data.data);
    
            //Ottengo Array di elementi non ripetibili
            const nuoveCategorie = Array.from(
              new Set(response.data.data.map((el) => el.categoria))
            );
    
            //Aggiungo all'inizio termine all
            nuoveCategorie.unshift("all");
            setCategorie(nuoveCategorie);
    
            //Termino Caricamento
            setIsLoading(false);
          } catch (error) {
            //Errore
            setIsError(true);
            setIsLoading(false);
            console.log(error);
          }
        })();
      }, []);

    return (
        <div className="container">
            <h4 style={h4Style}>Le nostre scelte</h4>
            {
            //Se non sto caricando e non ci sono errori
            !isLoading && !isError ? (
                <>
                <div className="lista-categorie">
                    {categorie.map((categoria, index) => (
                        <button className={`btn btn-selector ${selected === index && "active"}`}
                        key={index}
                        data-categoria={categoria}
                        onClick={() => filtraProdotti(categoria,index)}
                        >
                            {categoria}
                        </button>
                    ))}
                </div>
                <hr />
                <div className="vetrina">
                    {prodottiFiltrati.map((el) =>(
                        <Gelato key={el.id} {...el} />
                        ))}
                </div>
                </>
            ) : //Se non sto caricando ma ci sono errori
            !isLoading && isError ?
            (
                <h4 style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
                    Errore...
                </h4>
            ):(
                <h4 style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
                    Loading...
                </h4>
            )
            }
        </div>
    )
};

export default Menu;
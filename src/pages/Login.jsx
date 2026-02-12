import {useNavigate} from 'react-router-dom';

function NameForm(props){

    const navigate = useNavigate();

    function goToThanks(e){
        e.preventDefault();
        navigate('/thanks');
    }
    return (
        <form onSubmit={goToThanks}>
            <section>
                <label>Salutation:
                    <input type="text" onChange={props.handleSalutationChange}/>
                </label>
                <label>Name:
                    <input type="text" onChange={props.handleNameChange}/>
                </label>
            </section>
            <input type="submit" value="Submit" />
        </form>
    )
}

export default NameForm;
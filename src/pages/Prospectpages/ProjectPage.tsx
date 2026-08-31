import { useNavigate } from "react-router-dom"
import PageHeader from "../../components/Layout/PageHeader"
import { ProspectTable } from "../../components/Prospect/ProspectTable"

const Prospectpage = () => {
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column p-2">
            <div className="d-flex justify-content-between align-items-start mb-4">
                <PageHeader crumbs={['Prospects']} />
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/prospects/manage')}>
                    <i className="bi bi-plus-lg me-1"></i> New Prospect
                </button>
            </div>
            <ProspectTable />
        </div>
    )
}

export default Prospectpage
import { Link, useNavigate } from "react-router-dom"
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

            <div className="row g-4">
                <div className="col-12">
                    <div className="aegis-card">
                        <div className="aegis-card-header border-bottom pb-3 d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">Prospect Management</h6>

                        </div>
                        <div className="aegis-card-body p-0">
                            <ProspectTable />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Prospectpage
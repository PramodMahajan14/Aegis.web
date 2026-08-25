import { Button } from 'primereact/button';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';

type Severity = 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'help' | 'contrast';

const severities: Severity[] = ['success', 'info', 'warning', 'danger', 'secondary', 'help', 'contrast'];

export default function Buttons() {
  return (
    <>
      <PageHeader title="Buttons" crumbs={['UI Elements', 'Buttons']} />
      <div className="row g-3">
        <div className="col-lg-6">
          <Card title="Solid Buttons">
            <div className="d-flex flex-wrap gap-2">
              <Button label="primary" />
              {severities.map((s) => (
                <Button key={s} label={s} severity={s} />
              ))}
            </div>
          </Card>
        </div>
        <div className="col-lg-6">
          <Card title="Outline Buttons">
            <div className="d-flex flex-wrap gap-2">
              <Button label="primary" outlined />
              {severities.map((s) => (
                <Button key={s} label={s} severity={s} outlined />
              ))}
            </div>
          </Card>
        </div>
        <div className="col-lg-6">
          <Card title="Sizes">
            <div className="d-flex flex-wrap align-items-center gap-2">
              <Button label="Large" size="large" />
              <Button label="Default" />
              <Button label="Small" size="small" />
            </div>
          </Card>
        </div>
        <div className="col-lg-6">
          <Card title="Icon Buttons">
            <div className="d-flex flex-wrap gap-2">
              <Button label="Save" icon="pi pi-check" />
              <Button label="Delete" icon="pi pi-trash" severity="danger" outlined />
              <Button label="Export" icon="pi pi-download" severity="secondary" outlined />
            </div>
          </Card>
        </div>
        <div className="col-12">
          <Card title="Button Groups">
            <div className="p-buttonset me-3">
              <Button label="Left" outlined severity="secondary" />
              <Button label="Middle" outlined severity="secondary" />
              <Button label="Right" outlined severity="secondary" />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

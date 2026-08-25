import { useState } from 'react';
import type { ColorPickerChangeEvent, ColorPickerRGBType } from 'primereact/colorpicker';
import { ColorPicker } from 'primereact/colorpicker';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { PickList } from 'primereact/picklist';
import { Chips } from 'primereact/chips';
import { Slider } from 'primereact/slider';
import { Calendar } from 'primereact/calendar';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/Card';
import { maskMoney, maskIPAddress, maskCreditCard, maskSerialKey } from '../../utils/masks';

const basicOptions = [
  { value: 'ny', label: 'New York' },
  { value: 'la', label: 'Los Angeles' },
  { value: 'chi', label: 'Chicago' },
  { value: 'hou', label: 'Houston' },
];

const optGroupOptions = [
  { group: 'Fruits', items: [{ value: 'apple', label: 'Apple' }, { value: 'banana', label: 'Banana' }] },
  { group: 'Vegetables', items: [{ value: 'carrot', label: 'Carrot' }, { value: 'potato', label: 'Potato' }] },
];

const disabledOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'In Review', disabled: true },
  { value: 'published', label: 'Published' },
];

const checkboxOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
  { value: 'locked', label: 'Locked', disabled: true },
];

const states = [
  'Alaska', 'Hawaii', 'California', 'Nevada', 'Oregon', 'Washington', 'Arizona', 'Colorado',
  'Idaho', 'Montana', 'Nebraska', 'New Mexico', 'North Dakota', 'Utah', 'Wyoming',
].map((name) => ({ name }));

export default function FormsAdvanced() {
  const [hex, setHex] = useState('00aabb');
  const [rgba, setRgba] = useState<ColorPickerRGBType>({ r: 73, g: 197, b: 182 });

  const [basic, setBasic] = useState<string | null>(null);
  const [grouped, setGrouped] = useState<string | null>(null);
  const [multi, setMulti] = useState<string[]>([]);
  const [clearable, setClearable] = useState<string | null>('ny');
  const [limited, setLimited] = useState<string[]>([]);
  const [disabledPick, setDisabledPick] = useState<string | null>(null);

  const [loadingOptions, setLoadingOptions] = useState<typeof basicOptions>([]);
  const [loadingSelect, setLoadingSelect] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState<string | null>(null);

  function handleLoadingShow() {
    if (loadingOptions.length === 0 && !loadingSelect) {
      setLoadingSelect(true);
      setTimeout(() => {
        setLoadingOptions(basicOptions);
        setLoadingSelect(false);
      }, 600);
    }
  }

  const [money, setMoney] = useState('');
  const [ip, setIp] = useState('');
  const [card, setCard] = useState('');
  const [serial, setSerial] = useState('');

  const [available, setAvailable] = useState(states);
  const [chosen, setChosen] = useState<typeof states>([]);

  const [tags, setTags] = useState(['Amsterdam', 'Washington', 'Sydney']);

  const [singleRange, setSingleRange] = useState(30);
  const [dualRange, setDualRange] = useState<[number, number]>([32500, 62500]);

  const [inlineDate, setInlineDate] = useState<Date | null>(new Date());

  return (
    <>
      <PageHeader title="Advanced Elements" crumbs={['Forms', 'Advanced Elements']} />

      <div className="row g-3">
        <div className="col-12">
          <Card title="Color Pickers">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Hex Code</label>
                <div className="d-flex align-items-center gap-2">
                  <ColorPicker value={hex} onChange={(e: ColorPickerChangeEvent) => setHex(e.value as string)} />
                  <InputText value={'#' + hex} readOnly className="w-100" />
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">RGB(A) Code</label>
                <div className="d-flex align-items-center gap-2">
                  <ColorPicker
                    format="rgb"
                    value={rgba}
                    onChange={(e: ColorPickerChangeEvent) => setRgba(e.value as ColorPickerRGBType)}
                  />
                  <InputText value={`rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`} readOnly className="w-100" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12">
          <Card title="Advanced Select" action={<span className="text-muted small">search-as-you-type dropdowns</span>}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Basic</label>
                <Dropdown
                  value={basic}
                  onChange={(e) => setBasic(e.value)}
                  options={basicOptions}
                  optionLabel="label"
                  optionValue="value"
                  filter
                  placeholder="Select"
                  className="w-100"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">With OptGroups</label>
                <Dropdown
                  value={grouped}
                  onChange={(e) => setGrouped(e.value)}
                  options={optGroupOptions}
                  optionGroupLabel="group"
                  optionGroupChildren="items"
                  optionLabel="label"
                  optionValue="value"
                  filter
                  placeholder="Select"
                  className="w-100"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Multiple Select</label>
                <MultiSelect
                  value={multi}
                  onChange={(e) => setMulti(e.value)}
                  options={basicOptions}
                  optionLabel="label"
                  optionValue="value"
                  filter
                  placeholder="Select"
                  className="w-100"
                  display="chip"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">With Clear Button</label>
                <Dropdown
                  value={clearable}
                  onChange={(e) => setClearable(e.value)}
                  options={basicOptions}
                  optionLabel="label"
                  optionValue="value"
                  showClear
                  placeholder="Select"
                  className="w-100"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Max Selection Limit: 2</label>
                <MultiSelect
                  value={limited}
                  onChange={(e) => setLimited(e.value)}
                  options={basicOptions}
                  optionLabel="label"
                  optionValue="value"
                  selectionLimit={2}
                  placeholder="Select"
                  className="w-100"
                  display="chip"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Loading Data</label>
                <Dropdown
                  value={loadingOpen}
                  onChange={(e) => setLoadingOpen(e.value)}
                  onShow={handleLoadingShow}
                  options={loadingOptions}
                  optionLabel="label"
                  optionValue="value"
                  loading={loadingSelect}
                  placeholder="Select"
                  className="w-100"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Disabled Option</label>
                <Dropdown
                  value={disabledPick}
                  onChange={(e) => setDisabledPick(e.value)}
                  options={disabledOptions}
                  optionLabel="label"
                  optionValue="value"
                  optionDisabled="disabled"
                  placeholder="Select"
                  className="w-100"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12">
          <Card title="Masked Text Inputs">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Phone</label>
                <InputMask mask="(999) 999-9999" placeholder="(999) 999-9999" className="w-100" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Phone + Ext</label>
                <InputMask mask="(999) 999-9999? x99999" placeholder="(999) 999-9999? x99999" className="w-100" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Tax ID</label>
                <InputMask mask="99-9999999" placeholder="99-9999999" className="w-100" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">SSN</label>
                <InputMask mask="999-99-9999" placeholder="999-99-9999" className="w-100" />
              </div>
            </div>
            <hr className="my-3" />
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Mobile Phone Number</label>
                <InputMask mask="(999) 999-9999" className="w-100" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Money (Dollar)</label>
                <InputText value={money} onChange={(e) => setMoney(maskMoney(e.target.value))} className="w-100" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">IP Address</label>
                <InputText value={ip} onChange={(e) => setIp(maskIPAddress(e.target.value))} className="w-100" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Credit Card</label>
                <InputText value={card} onChange={(e) => setCard(maskCreditCard(e.target.value))} className="w-100" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <InputText type="email" className="w-100" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Serial Key</label>
                <InputText value={serial} onChange={(e) => setSerial(maskSerialKey(e.target.value))} className="w-100" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Date</label>
                <Calendar dateFormat="yy-mm-dd" showIcon className="w-100" />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Time</label>
                <Calendar timeOnly showIcon icon="pi pi-clock" className="w-100" />
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12">
          <Card title="Multi Select" action={<span className="text-muted small">move between panels</span>}>
            <label className="form-label small fw-semibold">Assign states</label>
            <PickList
              dataKey="name"
              source={available}
              target={chosen}
              onChange={(e) => {
                setAvailable(e.source);
                setChosen(e.target);
              }}
              itemTemplate={(item: { name: string }) => <span>{item.name}</span>}
              sourceHeader="Available"
              targetHeader="Assigned"
              sourceStyle={{ height: 220 }}
              targetStyle={{ height: 220 }}
            />
          </Card>
        </div>

        <div className="col-12">
          <Card title="Checkbox Multiselect">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Default</label>
                <MultiSelect
                  options={checkboxOptions}
                  optionLabel="label"
                  optionValue="value"
                  optionDisabled="disabled"
                  showSelectAll={false}
                  placeholder="None selected"
                  className="w-100"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Select All Enabled</label>
                <MultiSelect
                  options={checkboxOptions}
                  optionLabel="label"
                  optionValue="value"
                  optionDisabled="disabled"
                  placeholder="None selected"
                  className="w-100"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Filter Enabled</label>
                <MultiSelect
                  options={checkboxOptions}
                  optionLabel="label"
                  optionValue="value"
                  optionDisabled="disabled"
                  filter
                  placeholder="None selected"
                  className="w-100"
                />
              </div>
              <div className="col-md-3">
                <label className="form-label small fw-semibold">Single Selection</label>
                <Dropdown
                  options={checkboxOptions}
                  optionLabel="label"
                  optionValue="value"
                  optionDisabled="disabled"
                  placeholder="None selected"
                  className="w-100"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="col-12">
          <Card title="Tags Input">
            <label className="form-label small fw-semibold">Cities</label>
            <Chips value={tags} onChange={(e) => setTags(e.value ?? [])} className="w-100" />
            <div className="text-muted small mt-1">Press enter to add a tag</div>
          </Card>
        </div>

        <div className="col-lg-6">
          <Card title="Input Slider">
            <div className="mb-4">
              <label className="form-label small fw-semibold">Basic Example</label>
              <div className="text-muted small mb-1">Value: {singleRange}%</div>
              <Slider value={singleRange} onChange={(e) => setSingleRange(e.value as number)} />
            </div>
            <label className="form-label small fw-semibold">Range Example</label>
            <div className="text-muted small mb-1">
              Value: {dualRange[0].toLocaleString('en-US')}, {dualRange[1].toLocaleString('en-US')}
            </div>
            <Slider
              value={dualRange}
              onChange={(e) => setDualRange(e.value as [number, number])}
              range
              min={0}
              max={100000}
            />
          </Card>
        </div>

        <div className="col-lg-6">
          <Card title="Date Picker">
            <label className="form-label small fw-semibold">Inline</label>
            <Calendar value={inlineDate} onChange={(e) => setInlineDate(e.value ?? null)} inline className="w-100" />
          </Card>
        </div>
      </div>
    </>
  );
}

import React from 'react'

interface Props {
  onChange: (text: string) => void
  onSelect: (text: string) => void
  value: string
  options: { value: string; label: string }[]
}

const Search: React.FC<Props> = ({
  onChange,
  onSelect,
  value,
  options,
  ...props
}: Props) => (
  <div {...props} className="box p-0">
    <input
      type="text"
      className="input"
      placeholder="Search"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
    <div className="menu">
      <ul className="menu-list">
        {options.map(({ value, label }) => (
          <li key={value} title={value}>
            <a onClick={() => onSelect(value)}>{label}</a>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

export default Search

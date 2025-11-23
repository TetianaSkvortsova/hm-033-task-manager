import './PriorityLabel.css';

export default function PriorityLabel({priority}) {
  return (
    <strong className={'PriorityLabel_'+priority}>{priority}</strong>
  )
}
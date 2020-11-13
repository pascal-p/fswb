import { Popup } from 'semantic-ui-react';

function YaPopup({ content, trigger} ) {
  return (
    <Popup content={content}
      inverted
      trigger={trigger} />
  )
}

export default YaPopup;

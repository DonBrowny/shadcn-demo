import { useSelector } from 'react-redux'
import { userSelectors } from './scopes-slice'

export const scopesHook = {
  getScopes: () => useSelector(userSelectors.getUserScopes),
}

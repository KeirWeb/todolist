import { Dispatch } from "redux"
import { appActions } from "app/app.slise"
import { BaseResponseType } from "../types"

export const handleServerAppError = <D>(
  data: BaseResponseType<D>,
  dispatch: Dispatch,
  showError: boolean = true,
): void => {
  if (showError) {
    debugger
    dispatch(
      appActions.setAppError({
        error: data.messages.length ? data.messages[0] : "Some error occurred",
      }),
    )
  }
}

import { Mutation, ExecutionResult } from "react-apollo"
import * as React from "react"
import getSelectedTexts from "src/utils/getSelectedTexts"
import Loader from "src/components/universal/Loader"
import { withRouter, RouteComponentProps } from "react-router-dom"
import { ISelectablePoem, IPoem, ITextChunk } from "../types"
import {
  UPDATE_POEM,
  CREATE_POEM,
  ICreatePoemResp,
  IUpdatePoemResp,
} from "./poemMutations"
import { GET_USER } from "../manyPoemViews/ProfileView"
import { random } from "lodash"
import { GET_POEMS } from "../manyPoemViews/graphql"

interface IProps extends RouteComponentProps<{ id: string }> {
  children?: ({ onClick }: { onClick: () => void }) => JSX.Element
  poem: ISelectablePoem | IPoem
  styleView?: boolean
}

const SavePoemButton = ({ history, poem, children, styleView }: IProps) => {
  return (
    <Mutation
      mutation={poem.id ? UPDATE_POEM : CREATE_POEM}
      refetchQueries={[
        { query: GET_USER, variables: { id: poem.author?.id } },
        { query: GET_POEMS, variables: { offset: 0 } },
        {
          query: GET_POEMS,
          variables: { offset: 0, authorId: poem.author?.id },
        },
      ]}
    >
      {(
        savePoem,
        // @ts-ignore - says loading not there but it is
        { data, loading }: ExecutionResult<ICreatePoemResp | IUpdatePoemResp>,
      ) => {
        if (loading)
          return (
            <div className="toolbar-tab text-center">
              <Loader />
            </div>
          )
        if (!children) return
        let textChunks: ITextChunk[]
        if (styleView && poem.textChunks) {
          // remove _type
          textChunks = poem.textChunks.map((t) => ({
            isSelected: t.isSelected,
            text: t.text,
          }))
        } else {
          // @ts-ignore
          textChunks = getSelectedTexts((poem as ISelectablePoem).wordLetters)
        }

        return children({
          onClick: () => {
            savePoem({
              variables: {
                textChunks,
                id: poem && poem.id,
                passage: poem.passage,
                backgroundId: poem.backgroundId || random(20),
                colorRange: poem.colorRange || random(36),
              },
            })
              .then((res) => {
                if (!res) return
                if (!res.data) return
                const newPoem =
                  (res.data as ICreatePoemResp).createPoem ||
                  (res.data as IUpdatePoemResp).updatePoem
                if (styleView) {
                  history.push(`/`)
                } else {
                  history.push(`/edit/stylize/${newPoem.id}`)
                }
              })
              .catch((res) => {
                history.push("?showLogin=true")
              })
          },
        })
      }}
    </Mutation>
  )
}

export default withRouter(SavePoemButton)

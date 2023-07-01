import {GroupField} from "@prismicio/types/src/value/group";
import {AnyRegularField, FieldState} from "@prismicio/types/src/value/types";

export type RelationGroupType<ContentField extends Record<string, AnyRegularField>, State extends FieldState> = GroupField<ContentField, State>

/*
 * Copyright (C) 2017 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { interfaces } from "inversify";
import {
    createPreferenceProxy,
    PreferenceProxy,
    PreferenceService,
    PreferenceContribution,
    PreferenceSchema,
    PreferenceChangeEvent
} from '@theia/preferences-api';

export const editorPreferenceSchema: PreferenceSchema = {
    "type": "object",
    "properties": {
        "editor.tabSize": {
            "type": "number",
            "minimum": 1,
            "description": "Configure the tab size in the editor"
        },
        "editor.lineNumbers": {
            "enum": [
                "on",
                "off"
            ],
            "description": "Control the rendering of line numbers"
        },
        "editor.renderWhitespace": {
            "enum": [
                "none",
                "boundary",
                "all"
            ],
            "description": "Control the rendering of whitespaces in the editor"
        },
        "editor.autoSave": {
            "enum": [
                "on",
                "off"
            ],
            "default": "on",
            "description": "Configure whether the editor should be auto saved"
        },
        "editor.autoSaveDelay": {
            "type": "number",
            "default": 500,
            "description": "Configure the auto save delay in milliseconds"
        },
        "editor.minimap.enabled": {
            "type": "boolean",
            "default": false,
            "description": "Enable the rendering of the minimap."
        },
        "editor.cursorBlinking": {
            "enum": [
                "blink", "smooth", "phase", "expand", "solid"
            ],
            "default": "blink",
            "description": "Control the cursor animation style, possible values are 'blink', 'smooth', 'phase', 'expand' and 'solid'."
        },
        "editor.cursorStyle": {
            "enum": [
                "block", "line"
            ],
            "default": "line",
            "description": "Control the cursor style, either 'block' or 'line'. Defaults to 'line'."
        },
        "editor.fontLigatures": {
            "type": "boolean",
            "default": "false",
            "description": "Enable font ligatures. Defaults to false."
        },
        "editor.scrollBeyondLastLine": {
            "type": "boolean",
            "default": "true",
            "description": "Enable that scrolling can go one screen size after the last line. Defaults to true."
        },
        "editor.wordWrap": {
            "enum": [
                'off', 'on', 'wordWrapColumn', 'bounded'
            ],
            "default": "off",
            "description": `Control the wrapping of the editor.
             When \`wordWrap\` = "off", the lines will never wrap.
             When \`wordWrap\` = "on", the lines will wrap at the viewport width.
             When \`wordWrap\` = "wordWrapColumn", the lines will wrap at \`wordWrapColumn\`.
             When \`wordWrap\` = "bounded", the lines will wrap at min(viewport width, wordWrapColumn).
             Defaults to "off".`
        },
        "editor.wordWrapColumn": {
            "type": "number",
            "default": "80",
            "description": "Control when to wrap in an editor. Defaults to 80."
        },
        "editor.wordWrapMinified": {
            "type": "boolean",
            "default": "true",
            "description": "Force word wrapping when the text appears to be of a minified/generated file. Defaults to true."
        },
        "editor.wrappingIndent": {
            "enum": [
                'none', 'same', 'indent'
            ],
            "default": "same",
            "description": "Defaults to 'same'."
        },
        "editor.wordWrapBreakBeforeCharacters": {
            "tyoe": "string",
            "default": "{([+",
            "description": "Configure word wrapping characters. A break will be introduced before these characters. Defaults to '{([+'."
        },
        "editor.wordWrapBreakAfterCharacters": {
            "tyoe": "string",
            "default": " \t})]?|&,;",
            "description": "Configure word wrapping characters. A break will be introduced after these characters. Defaults to ' \t})]?|&,;'."
        },
        "editor.wordWrapBreakObtrusiveCharacters": {
            "tyoe": "string",
            "default": ".",
            "description": "Configure word wrapping characters. A break will be introduced after these "
                + "characters only if no `wordWrapBreakBeforeCharacters` or `wordWrapBreakAfterCharacters` were found."
        },
        // diff editor options
        "diffeditor.enableSplitViewResizing": {
            "type": "boolean",
            "default": true,
            "description": "Allow the user to resize the diff editor split view. Defaults to true."
        },
        "diffeditor.renderSideBySide": {
            "type": "boolean",
            "default": true,
            "description": "Render the differences in two side-by-side editors. Defaults to true."
        },
        "diffeditor.ignoreTrimWhitespace": {
            "type": "boolean",
            "default": true,
            "description": "Compute the diff by ignoring leading/trailing whitespace. Defaults to true."
        },
        "diffeditor.renderIndicators": {
            "type": "boolean",
            "default": true,
            "description": "Render +/- indicators for added/deleted changes. Defaults to true."
        }
    }
};

export interface EditorConfiguration {
    'editor.tabSize': number
    'editor.lineNumbers': 'on' | 'off'
    'editor.renderWhitespace': 'none' | 'boundary' | 'all'
    'editor.autoSave': 'on' | 'off'
    'editor.autoSaveDelay': number

}
export type EditorPreferenceChange = PreferenceChangeEvent<EditorConfiguration>;

export const defaultEditorConfiguration: EditorConfiguration = {
    'editor.tabSize': 4,
    'editor.lineNumbers': 'on',
    'editor.renderWhitespace': 'none',
    'editor.autoSave': 'on',
    'editor.autoSaveDelay': 500
};

export const EditorPreferences = Symbol('EditorPreferences');
export type EditorPreferences = PreferenceProxy<EditorConfiguration>;

export function createEditorPreferences(preferences: PreferenceService): EditorPreferences {
    return createPreferenceProxy(preferences, defaultEditorConfiguration, editorPreferenceSchema);
}

export function bindEditorPreferences(bind: interfaces.Bind): void {
    bind(EditorPreferences).toDynamicValue(ctx => {
        const preferences = ctx.container.get(PreferenceService);
        return createEditorPreferences(preferences);
    });

    bind(PreferenceContribution).toConstantValue({ schema: editorPreferenceSchema });
}

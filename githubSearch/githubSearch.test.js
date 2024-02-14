/**
 * @jest-environment jsdom
 */

import fs from "fs"
import { jest } from '@jest/globals';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import "@testing-library/jest-dom"
import domTesting from "@testing-library/dom"
import userEvent from"@testing-library/user-event"

function initDomFromFiles(htmlPath, jsPath) {
    const html = fs.readFileSync(htmlPath, 'utf8')
    document.open()
    document.write(html)
    document.close()
    jest.isolateModules(function () {
        import(jsPath)
    })
}

test("correctly renders GitHub search results", async function () {
    initDomFromFiles(
        __dirname + "/githubSearch.html",
        __dirname + "/githubSearch.js"
    )

    const queryInput = domTesting.getByPlaceholderText(
        document,
        "Search GitHub"
    )
    const searchButton = domTesting.getByRole(document, "button")

    const user = userEvent.setup()
    await user.type(queryInput, "jest")
    await user.click(searchButton)

    const results = await domTesting.findAllByRole(document, "listitem")
    expect(results).not.toHaveLength(0)
})

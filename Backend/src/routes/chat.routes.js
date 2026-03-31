import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import {sendMessage , getChats , getMessages, editChatTitle , deleteChat , savePrompt , getSavedPrompt , deletePrompt} from '../controllers/chat.controllers.js'


const router = Router()


/**
 * @desc create new chat or folow up messages
 * @route POST /api/chats/message
 * @access private
 */
router.post('/message', authUser , sendMessage )


/**
 * @route GET /api/chats
 * @desc  get all chats (title , user)
 * @access private
 */
router.get('/' , authUser , getChats)


/**
 * @route GET /api/chats/:chatId/messages
 * @desc fetch message of chat
 * @access private
 */
router.get('/:chatId/messages' , authUser , getMessages)




/** 
 * @route DELETE  /api/chats/:chatId
 * @desc delete the user's chat
 * @access private
*/

router.delete('/:chatId', authUser , deleteChat)



/** 
 * @route PATCH /api/chats/:chatId/edit-title
 * @desc edit chat title
 * @access private
*/
router.patch('/:chatId/edit-title' , authUser , editChatTitle )



/**
 * @route POST /api/chats/save-prompt
 * @desc save prompt to database
 * @access private
*/

router.post('/save-prompt' , authUser , savePrompt)


/**
 * @route GET /api/chats/saved-prompt
 * @desc get all saved prompt
 * @access private
 */

router.get('/saved-prompt' , authUser , getSavedPrompt)

/**
 * @route DELETE /api/chats/delete-prompt/:pomptId
 * @desc delete saved prompt
 * @access private
 */

router.delete('/delete-prompt/:promptId' ,authUser , deletePrompt)


export default router
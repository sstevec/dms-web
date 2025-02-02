import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import React from "react";
import userService from "../../services/UserService";

const handleAcceptInvitation = async (email, userId) => {
    try{
        await userService.acceptInvitation(email, userId);
    } catch (error){
        alert("Fail to accept invitation!")
    }

}

const AcceptInvitationDialog = ({open, setOpen, senderEmail, userId}) =>
    (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="accept-invitation-dialog-title"
            aria-describedby="accept-invitation-dialog-description"
        >
            <DialogTitle id="accept-invitation-dialog-title">Accept Invitation</DialogTitle>
            <DialogContent>
                <DialogContentText id="accept-invitation-dialog-description">
                    Are you sure you want to become a distributor for {senderEmail}?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => {
                    handleAcceptInvitation(senderEmail, userId);
                    setOpen(false);
                }} color="error" autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>)

export default AcceptInvitationDialog;
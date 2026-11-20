package com.skillbridge.state;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.skillbridge.user.UserAccount;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/state")
public class AppStateController {
    private final AppStateRepository states;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    public AppStateController(AppStateRepository states, com.fasterxml.jackson.databind.ObjectMapper objectMapper) {
        this.states = states;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public JsonNode getState(@AuthenticationPrincipal UserAccount user) {
        return states.findByUserId(user.getId())
                .map(state -> {
                    try {
                        return objectMapper.readTree(state.getStateJson());
                    } catch (com.fasterxml.jackson.core.JsonProcessingException exception) {
                        throw new IllegalStateException("Stored account data is invalid JSON.", exception);
                    }
                })
                .orElseGet(JsonNodeFactory.instance::objectNode);
    }

    @PutMapping
    @Transactional
    public void saveState(@AuthenticationPrincipal UserAccount user, @RequestBody JsonNode state) {
        if (state == null || !state.isObject()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Account data must be a JSON object.");
        }
        String json;
        try {
            json = objectMapper.writeValueAsString(state);
        } catch (com.fasterxml.jackson.core.JsonProcessingException exception) {
            throw new IllegalArgumentException("Account data could not be serialized.", exception);
        }
        AppState saved = states.findByUserId(user.getId())
                .orElseGet(() -> new AppState(user, json));
        saved.setStateJson(json);
        states.save(saved);
    }
}

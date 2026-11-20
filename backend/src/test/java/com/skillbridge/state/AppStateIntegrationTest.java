package com.skillbridge.state;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillbridge.auth.AuthController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:skillbridge-test;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@AutoConfigureMockMvc
class AppStateIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void accountDataIsIsolatedBetweenSessions() throws Exception {
        MockHttpSession firstSession = register("first");
        mockMvc.perform(put("/api/state")
                        .session(firstSession)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"profile":{"name":"First User"},"skills":[{"name":"Java","level":"Beginner"}]}
                                """))
                .andExpect(status().isOk());

        MockHttpSession secondSession = register("second");

        mockMvc.perform(get("/api/state").session(firstSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skills[0].name").value("Java"));
        mockMvc.perform(get("/api/state").session(secondSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skills").doesNotExist());
    }

    @Test
    void accountDataRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/state"))
                .andExpect(status().isUnauthorized());
    }

    private MockHttpSession register(String prefix) throws Exception {
        String email = prefix + "-" + UUID.randomUUID() + "@example.test";
        String body = objectMapper.writeValueAsString(
                new AuthController.RegisterRequest("Test User", email, "TestPassword123!"));
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn();
        MockHttpSession session = (MockHttpSession) result.getRequest().getSession(false);
        assertNotNull(session);
        return session;
    }
}
